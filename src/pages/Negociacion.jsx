import { Link, useNavigate, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Spinner from '../components/Spinner'
import BalanzaIndicator from '../components/BalanzaIndicator'
import ConfirmTradeModal from '../components/ConfirmTradeModal'
import ContactUnlockedModal from '../components/ContactUnlockedModal'
import { useNegotiation } from '../hooks/useNegotiation'

// A single cromo inside an offer column (with a remove control).
function OfferCard({ sticker, onRemove }) {
  const isSpecial = sticker.rarity === 'gold' || sticker.rarity === 'legend'
  return (
    <div className="group relative rounded border border-outline-variant/20 bg-surface-container-lowest p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-start justify-between">
        <span
          className={`rounded px-2 py-0.5 text-label-sm font-bold ${
            isSpecial ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
          }`}
        >
          {sticker.team} {sticker.number}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Quitar ${sticker.name}`}
          className="text-on-surface-variant transition-colors hover:text-error"
        >
          <Icon name="close" className="!text-[18px]" />
        </button>
      </div>
      <div
        className={`mb-2 flex aspect-[3/4] items-center justify-center overflow-hidden rounded-sm border border-outline-variant/10 bg-gradient-to-br ${
          isSpecial ? 'from-secondary-fixed-dim to-secondary-container' : 'from-primary-container to-primary'
        }`}
      >
        <Icon name="person" fill className={`!text-[40px] ${isSpecial ? 'text-primary/40' : 'text-white/40'}`} />
      </div>
      <p className="truncate text-center text-label-md text-on-surface">{sticker.name}</p>
      <p className="mt-1 text-center text-label-sm text-on-surface-variant">{sticker.tier}</p>
    </div>
  )
}

function AddSlot() {
  return (
    <button
      type="button"
      className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded border border-dashed border-outline-variant/40 text-outline transition-colors hover:bg-surface-container-low"
    >
      <Icon name="add_circle" />
      <span className="text-label-sm">Añadir otro</span>
    </button>
  )
}

function OfferColumn({ title, subtitle, stickers, onRemove, tone = 'default' }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md text-primary">{title}</h2>
        <div className="flex items-center gap-2">
          {subtitle && <span className="text-label-sm text-on-surface-variant">{subtitle}</span>}
          <span className="rounded bg-surface-container-high px-2 py-1 text-label-sm">
            {stickers.length} {stickers.length === 1 ? 'Cromo' : 'Cromos'}
          </span>
        </div>
      </div>
      <div
        className={`grid min-h-[450px] grid-cols-2 content-start gap-4 rounded-xl border-2 border-dashed border-outline-variant/30 p-3 ${
          tone === 'muted' ? 'bg-surface-container-low/40' : ''
        }`}
      >
        {stickers.map((sticker) => (
          <OfferCard key={sticker.id} sticker={sticker} onRemove={() => onRemove(sticker.id)} />
        ))}
        <AddSlot />
      </div>
    </div>
  )
}

function InfoCard({ icon, title, children }) {
  return (
    <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon name={icon} className="!text-[20px] text-primary" />
        <p className="text-label-md font-bold text-primary">{title}</p>
      </div>
      <p className="text-label-sm text-on-surface-variant">{children}</p>
    </div>
  )
}

// Centered message panel for the non-table states (no match selected / error).
function NegotiationNotice({ icon, title, children }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface-container-low px-6 text-center">
      <Icon name={icon} className="!text-[48px] text-outline-variant" />
      <h2 className="text-headline-md text-primary">{title}</h2>
      <p className="max-w-sm text-body-md text-on-surface-variant">{children}</p>
      <Link
        to="/radar"
        className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md text-white transition-all hover:bg-primary-container"
      >
        <Icon name="radar" className="!text-[18px]" />
        Ir al Radar
      </Link>
    </div>
  )
}

function Negociacion() {
  const { collectorId } = useParams()
  const navigate = useNavigate()
  const {
    loading,
    error,
    partner,
    timeLeft,
    youOffer,
    theyOffer,
    confirmOpen,
    contactOpen,
    confirming,
    confirmError,
    balance,
    canConfirm,
    removeFromYou,
    removeFromThem,
    setConfirmOpen,
    setContactOpen,
    handleConfirm,
  } = useNegotiation(collectorId)

  // Reached via the sidebar with no collector selected — point back to the radar.
  if (!collectorId) {
    return (
      <NegotiationNotice icon="swap_horiz" title="Ningún intercambio abierto">
        Elige un coleccionista en el Radar para abrir la mesa de negociación.
      </NegotiationNotice>
    )
  }

  if (loading) return <Spinner label="Cargando intercambio" />

  if (error) {
    return (
      <NegotiationNotice icon="error" title="No se pudo abrir la mesa">
        {error}
      </NegotiationNotice>
    )
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-outline-variant/10 bg-surface/95 px-12 backdrop-blur-md">
        <h1 className="text-headline-md font-bold text-primary">Mesa de Negociación</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Icon name="timer" className="!text-[20px]" />
            <span className="text-label-md">La oferta expira en {timeLeft}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-lg bg-primary-container px-6 py-2 text-label-md text-white transition-opacity hover:opacity-90"
          >
            Conservar
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] p-12">
        <div className="grid grid-cols-12 items-stretch gap-6">
          {/* Tú ofreces */}
          <div className="col-span-12 lg:col-span-5">
            <OfferColumn title="Tú ofreces" stickers={youOffer} onRemove={removeFromYou} />
          </div>

          {/* Balanza */}
          <div className="relative col-span-12 flex flex-col items-center justify-center py-8 lg:col-span-2">
            <div className="absolute hidden h-full w-px bg-outline-variant/20 lg:block" />
            <BalanzaIndicator balance={balance} />
          </div>

          {/* Ellos ofrecen */}
          <div className="col-span-12 lg:col-span-5">
            <OfferColumn
              title="Ellos ofrecen"
              subtitle={partner.username}
              stickers={theyOffer}
              onRemove={removeFromThem}
              tone="muted"
            />
          </div>
        </div>

        {/* Info row */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <InfoCard icon="history" title="Historial Reciente">
            {partner.username} completó {partner.successfulTrades} intercambios con 0 incidencias.
          </InfoCard>
          {/* Generic safety tip — not user data, shown for every trade. */}
          <InfoCard icon="edit_note" title="Notas de Trading">
            Prefiere encuentros en zonas públicas y horario diurno.
          </InfoCard>
          <InfoCard icon="verified_user" title="Intercambio Protegido">
            El contacto solo se revela tras confirmar ambas partes.
          </InfoCard>
        </div>
      </div>

      {/* Fixed action bar */}
      <div className="fixed bottom-0 left-64 right-0 z-30 flex items-center justify-between border-t border-outline-variant/10 bg-surface/95 px-12 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
          <span className="text-label-md">Esperando tu confirmación</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-outline-variant/40 px-6 py-3 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={!canConfirm}
            className="flex items-center gap-2 rounded-lg bg-secondary-container px-12 py-3 text-label-md font-bold text-on-secondary-container shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="handshake" className="!text-[20px]" />
            Confirmar intercambio
          </button>
        </div>
      </div>

      {/* Modals */}
      <ConfirmTradeModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        youCount={youOffer.length}
        theyCount={theyOffer.length}
        partner={partner}
        balance={balance}
        confirming={confirming}
        error={confirmError}
      />
      <ContactUnlockedModal open={contactOpen} onClose={() => setContactOpen(false)} partner={partner} />
    </div>
  )
}

export default Negociacion
