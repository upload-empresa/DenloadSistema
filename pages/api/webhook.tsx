import { NextApiRequest, NextApiResponse } from "next";
import Stripe from 'stripe';
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-08-01',
})

type Data = {
    ok: boolean
}

export const config = {
    api: {
        bodyParser: false
    }
}

//@ts-ignore
async function buffer(readable) {
    const chuncks = []
    for await (const chunck of readable) {
        chuncks.push(typeof chunck === 'string' ? Buffer.from(chunck) : chunck)
    }
    return Buffer.concat(chuncks)
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'GET') {
        return res.send({
            ok: true
        })
    }

    if (req.method === 'POST') {
        const buf = await buffer(req)
        const sig = req.headers['stripe-signature']

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                buf,
                sig as string,
                webhookSecret as string
            )

            const checkoutSession = event.data.object as Stripe.Checkout.Session

            switch (event.type) {
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    //@ts-ignore
                    const stripeSubscriptionId = event?.data?.object?.id
                    //@ts-ignore
                    const status = event?.data?.object?.status
                    //@ts-ignore
                    const stripeCustomerId = event?.data?.object?.customer
                    //@ts-ignore
                    const currentPeriodStart = new Date(event?.data?.object?.current_period_start * 1000)
                    //@ts-ignore
                    const currentPeriodEnd = new Date(event?.data?.object?.current_period_end * 1000)

                    const site = await prisma.site.findFirst({
                        where: {
                            stripeCustomer: stripeCustomerId
                        }
                    })
                    await prisma.subscription.create({
                        data: {
                            siteId: site?.id as string,
                            subscriptionStatus: true,
                            stripeId: stripeSubscriptionId,
                            currentPeriodStart,
                            currentPeriodEnd
                        }
                    })
                    break
                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session
                    const customerId = checkoutSession.customer as string
                    const subscriptionId = checkoutSession.subscription as string

                    const customer = await stripe.customers.retrieve(customerId)

                    await prisma.subscription.create({
                        data: {
                            siteId: 'uhaiofhoa',
                            subscriptionStatus: true,
                            stripeId: subscriptionId,
                            currentPeriodStart: '2023-06-06 14:33:51.056',
                            currentPeriodEnd: '2023-06-06 14:33:51.056'
                        }
                    })

                    break;
                default:
                    throw new Error('Unhandled relevant event!')
            }

        } catch (err) {
            //@ts-ignore
            console.log(`Error message: ${err.message}`);
            return res.status(400).send({ ok: false });
        }
    }
    res.status(200).json({
        ok: false,
    });
}