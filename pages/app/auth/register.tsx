import { useState } from 'react'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (event: any) => {
        event.preventDefault()

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error)
            }

            const user = await response.json()
            console.log(user)
        } catch (error) {
            //@ts-ignore
            setError(error.message)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>

            <button type="submit">Register</button>

            {error && <p>{error}</p>}
        </form>
    )
}
