import { NextApiRequest, NextApiResponse } from 'next'

import { CURRENCY, MIN_AMOUNT, MAX_AMOUNT } from '../../../config'
import { formatAmountForStripe } from '../../../utils/stripe-helpers'
import { getSession } from 'next-auth/react'
import { Site } from '@prisma/client'
import prisma from '@/lib/prisma'
import Stripe from 'stripe'
import { useRouter } from 'next/router'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-08-01',
})

interface SessionError {
    message: string
}

interface Cooper {
    site: Site | null;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const siteId = String(req.query.siteId)
    // const siteId = 'clifyly9p0000uf2s9k78mi36'
    const session = await getSession({ req })

    if (session) {
        const siteId = String(req.query.siteId)
    }

    if (req.method === 'POST') {
        const amount: number = req.body.amount
        try {

            const dbSite = await prisma.site.findFirst({
                where: {
                    id: siteId
                }
            })

            let stripeCustomerId = dbSite?.stripeCustomer

            const subscription = await prisma.subscription.findFirst({
                where: {
                    siteId,
                    subscriptionStatus: true
                }
            })
            if (subscription) {
                stripeCustomerId = dbSite?.stripeCustomer as string
                const portalSession = await stripe.billingPortal.sessions.create({
                    customer: stripeCustomerId,
                    return_url: `${req.headers.origin}/${siteId}/subscription?success=true`,
                })
                return res.redirect(303, portalSession.url as string)
            }

            if (!dbSite?.stripeCustomer) {
                const custumer = await stripe.customers.create({
                    metadata: {
                        id: siteId
                    }
                })
                await prisma.user.update({
                    where: {
                        id: '1'
                    },
                    data: {
                        gh_username: custumer.id
                    }
                })
                stripeCustomerId = custumer.id
            }
            // Validate the amount that was passed from the client.
            if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
                throw new Error('Invalid amount.')
            }

            // Create Checkout Sessions from body params.
            const params: Stripe.Checkout.SessionCreateParams = {
                // submit_type: 'donate',
                client_reference_id: siteId,
                customer: stripeCustomerId as string,
                payment_method_types: ['card'],
                mode: 'subscription',
                line_items: [
                    {
                        price: 'price_1NBe5CDDlFjzihqgJspWXCDi',
                        quantity: 1,
                    },
                ],
                subscription_data: {
                    trial_period_days: 10
                },
                success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/donate-with-checkout`,
            }


            const checkoutSession: Stripe.Checkout.Session =
                await stripe.checkout.sessions.create(params)



            await prisma.subscription.create({
                data: {
                    siteId: 'clikdste70000ufvcsfackrf3',
                    subscriptionStatus: true,
                    stripeId: 'whuiafiua',
                    currentPeriodStart: new Date(),
                    currentPeriodEnd: new Date()
                }
            })


            res.status(200).json(checkoutSession)
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Internal server error'
            res.status(500).json({ statusCode: 500, message: errorMessage })
        }
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method Not Allowed')
    }
}
