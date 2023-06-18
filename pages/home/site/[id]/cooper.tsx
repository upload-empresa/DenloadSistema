import { NextPage } from 'next'

import CheckoutForm from '../../../../components/CheckoutForm'
import { useRouter } from 'next/router';

const DonatePage: NextPage = () => {
    const router = useRouter();
    const { id: siteId } = router.query;
    return (
        <div className="page-container">
            <h1>Plano Cooper</h1>

            <CheckoutForm url={`/api/checkout_sessions/cooper?${siteId}`} />
        </div>
    )
}

export default DonatePage