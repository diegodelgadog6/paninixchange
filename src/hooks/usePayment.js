import { useCallback, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function usePayment() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkout = useCallback(
    async (plan) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan,
            success_url: `${window.location.origin}/premium?success=1`,
            cancel_url: `${window.location.origin}/premium?cancelled=1`,
          }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.detail ?? 'Error al iniciar el pago')
        }
        const { url } = await res.json()
        window.location.href = url
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    },
    [token],
  )

  return { checkout, loading, error }
}
