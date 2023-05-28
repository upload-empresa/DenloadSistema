import { NextPage } from 'next'

import CheckoutForm from '../../components/CheckoutForm'

const DonatePage: NextPage = () => {
    return (
        <div className="page-container">
            <h1>Plano Gold</h1>
            <CheckoutForm url='/api/checkout_sessions/gold' />
        </div>
    )
}

export default DonatePage