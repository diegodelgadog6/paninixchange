import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import Icon from '../components/Icon'
import { usePayment } from '../hooks/usePayment'
import { useAuth } from '../context/AuthContext'

// Pricing plans. In a real app these (and the price IDs) would come from Stripe.
const PLANS = [
  {
    id: 'free',
    name: 'Gratis',
    monthly: 0,
    yearly: 0,
    tagline: 'Para empezar a coleccionar',
    features: ['Álbum digital de 994 cromos', 'Radar hasta 5 km', '3 intercambios al mes', 'Balanza de equilibrio'],
    cta: 'Plan actual',
    featured: false,
    current: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 4.99,
    yearly: 47.9,
    tagline: 'El favorito de los coleccionistas',
    features: [
      'Todo lo de Gratis',
      'Radar ilimitado hasta 15 km',
      'Matches automáticos en tiempo real',
      'Intercambios ilimitados',
      'Insignia Pro y prioridad en matches',
    ],
    cta: 'Suscribirse',
    featured: true,
    current: false,
  },
  {
    id: 'legend',
    name: 'Leyenda',
    monthly: 9.99,
    yearly: 95.9,
    tagline: 'Para el coleccionista serio',
    features: [
      'Todo lo de Pro',
      'Acceso anticipado a cromos especiales',
      'Analítica avanzada de tu colección',
      'Soporte prioritario 24/7',
    ],
    cta: 'Suscribirse',
    featured: false,
    current: false,
  },
]

function PlanCard({ plan, yearly, onCheckout, loading, membershipCode }) {
  const RANK = { free: 0, pro: 1, legend: 2, leyenda: 2 }
  const isCurrent = plan.id === membershipCode || (plan.id === 'legend' && membershipCode === 'leyenda')
  const isLower = (RANK[plan.id] ?? 0) < (RANK[membershipCode] ?? 0)
  const isDisabled = isCurrent || isLower || loading
  const price = yearly ? plan.yearly : plan.monthly
  const period = yearly ? '/año' : '/mes'

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
        plan.featured
          ? 'border-secondary-container bg-primary-container text-white shadow-xl lg:-translate-y-2'
          : 'border-outline-variant/20 bg-white'
      }`}
    >
      {plan.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary-container px-3 py-1 text-label-sm font-bold uppercase tracking-wide text-primary">
          Recomendado
        </span>
      )}

      <h3 className={`text-headline-md ${plan.featured ? 'text-secondary-container' : 'text-primary'}`}>
        {plan.name}
      </h3>
      <p className={`mt-1 text-label-md ${plan.featured ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
        {plan.tagline}
      </p>

      <div className="my-6 flex items-end gap-1">
        <span className="font-display text-display-lg leading-none">${price}</span>
        <span className={`mb-1 text-label-md ${plan.featured ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>
          {period}
        </span>
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-body-md">
            <Icon
              name="check_circle"
              fill
              className={`!text-[20px] shrink-0 ${plan.featured ? 'text-secondary-container' : 'text-secondary'}`}
            />
            <span className={plan.featured ? 'text-white' : 'text-on-surface'}>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        disabled={isDisabled}
        onClick={() => !isDisabled && onCheckout(plan.id)}
        className={`w-full rounded-lg py-3 text-label-md font-bold transition-all active:scale-[0.98] ${
          isDisabled
            ? 'cursor-default border border-outline-variant/40 text-on-surface-variant'
            : plan.featured
              ? 'bg-secondary-container text-primary hover:bg-secondary-fixed'
              : 'bg-primary text-white hover:bg-primary-container'
        }`}
      >
        {isCurrent ? 'Plan actual' : isLower && plan.id === 'free' ? 'Cambiar a Gratis' : loading ? 'Redirigiendo…' : plan.cta}
      </button>
    </div>
  )
}

function Premium() {
  const [yearly, setYearly] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const membershipCode = user?.membershipCode ?? 'free'
  const navigate = useNavigate()
  const { checkout, loading, error } = usePayment()

  function handleCheckout(plan) {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (plan === 'free') return
    checkout(plan)
  }

  return (
    <div className="min-h-screen bg-surface">
      <TopNav />

      <main className="pt-20">
        {/* Header */}
        <section className="px-12 pb-12 pt-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary-container/20 px-4 py-1.5 text-label-md font-bold text-secondary">
            <Icon name="workspace_premium" fill className="!text-[18px]" />
            PaniniXchange Pro
          </span>
          <h1 className="mx-auto max-w-3xl text-display-lg tracking-tight text-primary">
            Completa tu álbum más rápido
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-on-surface-variant">
            Desbloquea el radar ilimitado, los matches automáticos y los intercambios sin límite.
            Cancela cuando quieras.
          </p>

          {/* Billing toggle (UI only) */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-outline-variant/20 bg-white p-1">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`rounded-full px-5 py-2 text-label-md transition-all ${
                !yearly ? 'bg-primary text-white' : 'text-on-surface-variant'
              }`}
            >
              Mensual
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-label-md transition-all ${
                yearly ? 'bg-primary text-white' : 'text-on-surface-variant'
              }`}
            >
              Anual
              <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold text-primary">
                -20%
              </span>
            </button>
          </div>
        </section>

        {/* Pricing */}
        <section className="px-12 pb-16">
          <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} yearly={yearly} onCheckout={handleCheckout} loading={loading} membershipCode={membershipCode} />
            ))}
          </div>

          {error && (
            <p className="mt-4 text-center text-label-md text-error">{error}</p>
          )}

          {/* Trust strip */}
          <div className="mx-auto mt-10 flex max-w-[1100px] flex-wrap items-center justify-center gap-x-8 gap-y-3 text-label-md text-on-surface-variant">
            <span className="flex items-center gap-2">
              <Icon name="lock" className="!text-[18px] text-primary" /> Pago seguro vía Stripe
            </span>
            <span className="flex items-center gap-2">
              <Icon name="event_repeat" className="!text-[18px] text-primary" /> Cancela cuando quieras
            </span>
            <span className="flex items-center gap-2">
              <Icon name="workspace_premium" className="!text-[18px] text-primary" /> 14 días de garantía
            </span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Premium
