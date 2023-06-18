import { NextPage } from 'next'

import CheckoutForm from '../../components/CheckoutForm'

const DonatePage: NextPage = () => {
    return (
        <div className="page-container">
            <h1>Plano Silver</h1>
            <CheckoutForm url='/api/checkout_sessions/silver' />
        </div>
    )
}

export default DonatePage