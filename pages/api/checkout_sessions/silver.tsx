import { NextApiRequest, NextApiResponse } from 'next'

import { MIN_AMOUNT, MAX_AMOUNT } from '../../../config'

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-08-01',
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const amount: number = req.body.amount
        try {
            if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
                throw new Error('Invalid amount.')
            }
            const params: Stripe.Checkout.SessionCreateParams = {
                payment_method_types: ['card'],
                mode: 'subscription',
                line_items: [
                    {
                        price: 'price_1NBeC9DDlFjzihqgxvyzAmdN',
                        quantity: 1,
                    },
                ],
                success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/donate-with-checkout`,
            }
            const checkoutSession: Stripe.Checkout.Session =
                await stripe.checkout.sessions.create(params)

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
