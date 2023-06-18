import { useState } from 'react'

export default function ForgotPassword() {
    const [error, setError] = useState(null)
    const [message, setMessage] = useState("")
    const [summary, setSummary] = useState('')
    const [daystart, setDayStart] = useState('')
    const [dayend, setDayEnd] = useState('')
    const [description, setDescription] = useState('')

    const handleLoginWithGoogle = () => {
        window.location.href = '/api/auth/inseriragenda'
    }

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault()

        try {
            const response = await fetch('/api/inseriragenda', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ summary, description, daystart, dayend }),
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error)
            }
            //@ts-ignore
            setMessage('Seu email de redefinição de senha foi enviado!')
        } catch (error) {
            //@ts-ignore
            setError(error.message)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input placeholder='consulta' type={summary} onChange={(e: any) => setSummary(e.target.value)} />
                <input placeholder='descrição' type={description} onChange={(e: any) => setDescription(e.target.value)} />
                <input placeholder='dia começa' type={daystart} onChange={(e: any) => setDayStart(e.target.value)} />
                <input placeholder='dia fim' type={dayend} onChange={(e: any) => setDayEnd(e.target.value)} />
                <button type="submit">Enviar</button>
                {error && <p>{error}</p>}
                {message && <p>{message}</p>}



            </form>
            <button onClick={handleLoginWithGoogle}>Login com o Google</button>
        </>
    )
}
