import React, { useState } from 'react'

import CustomDonationInput from '../components/CustomDonationInput'

import getStripe from '../utils/get-stripe'
import { fetchPostJSON } from '../utils/api-helpers'
import { formatAmountForDisplay } from '../utils/stripe-helpers'
import * as config from '../config'

interface CheckoutProps {
    url: any
}
const CheckoutForm = ({ url }: CheckoutProps) => {
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState({
        customDonation: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
    })

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
        setInput({
            ...input,
            [e.currentTarget.name]: e.currentTarget.value,
        })

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setLoading(true)
        // Create a Checkout Session.
        const response = await fetchPostJSON(url, {
            amount: 39,
        })

        if (response.statusCode === 500) {
            console.error(response.message)
            return
        }

        // Redirect to Checkout.
        const stripe = await getStripe()
        const { error } = await stripe!.redirectToCheckout({
            // Make the id field from the Checkout Session creation API response
            // available to this file, so you can provide it as parameter here
            // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
            sessionId: response.id,
        })
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `error.message`.
        console.warn(error.message)
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit}>

            <button
                className="checkout-style-background"
                type="submit"
                disabled={loading}
            >
                Comprar
            </button>
        </form>
    )
}

export default CheckoutForm