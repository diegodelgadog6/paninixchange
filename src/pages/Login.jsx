import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'

const fieldClass =
  'w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface outline-none transition-colors focus:border-primary'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // Where to land after a successful login (set by ProtectedRoute), else dashboard.
  const from = location.state?.from?.pathname ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Inicia sesión para seguir completando tu álbum."
      footer={
        <>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Crear cuenta
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-label-md text-on-surface">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder="tu@correo.com"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-label-md text-on-surface">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="flex items-center gap-2 rounded-lg bg-error-container px-3 py-2 text-label-md text-on-error-container">
            <Icon name="error" fill className="!text-[18px]" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary px-4 py-3 text-label-md font-semibold text-on-primary transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60"
        >
          {submitting ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login
