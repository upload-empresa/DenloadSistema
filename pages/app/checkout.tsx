import { NextPage } from 'next'
import Link from 'next/link'

const IndexPage: NextPage = () => {
    return (

        <ul className="card-list">
            <li>
                <Link
                    href="/cooper"
                    className="card checkout-style-background"
                >
                    <h2 className="bottom">Comprar o Plano Cooper</h2>

                </Link>
            </li>
            <li>
                <Link
                    href="/silver"
                    className="card checkout-style-background"
                >
                    <h2 className="bottom">Comprar o Plano Silver</h2>

                </Link>
            </li>
            <li>
                <Link
                    href="/gold"
                    className="card elements-style-background"
                >
                    <h2 className="bottom">Comprar o plano Gold</h2>

                </Link>
            </li>
            <li>
                <Link
                    href="/diamond"
                    className="card cart-style-background"
                >
                    <h2 className="bottom">Comprar o plano Diamond</h2>

                </Link>
            </li>
        </ul>

    )
}

export default IndexPage