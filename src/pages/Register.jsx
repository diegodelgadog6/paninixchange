import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'

const fieldClass =
  'w-full rounded-lg border border-outline-variant/40 bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface outline-none transition-colors focus:border-primary'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // register() auto-logs in, so we land straight in the shell.
      await register({ username, email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Únete a la red del coleccionista del Mundial 2026."
      footer={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Iniciar sesión
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="username" className="block text-label-md text-on-surface">
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={fieldClass}
            placeholder="tu_usuario"
          />
        </div>

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
            autoComplete="new-password"
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
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Register
