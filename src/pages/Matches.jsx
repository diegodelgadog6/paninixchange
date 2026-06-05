import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Spinner from '../components/Spinner'
import ContactUnlockedModal from '../components/ContactUnlockedModal'
import { useMatches } from '../context/MatchesContext'

// Small chips showing committed stickers on one side of a trade.
function CromoChips({ label, stickers }) {
  if (!stickers.length) return (
    <div>
      <p className="text-label-sm text-on-surface-variant">{label}</p>
      <p className="mt-0.5 text-label-sm italic text-outline">Sin cromos aún</p>
    </div>
  )
  return (
    <div>
      <p className="mb-1 text-label-sm text-on-surface-variant">
        {label} · {stickers.length}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {stickers.map((s) => (
          <span
            key={s.code ?? s.id}
            className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
              s.rarity === 'base'
                ? 'bg-surface-container-high text-on-surface-variant'
                : 'bg-secondary-container text-on-secondary-container'
            }`}
          >
            {s.team} {s.number}
          </span>
        ))}
      </div>
    </div>
  )
}

function PartnerHeader({ partner }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <img src={partner.avatar} alt={partner.name} className="h-11 w-11 rounded-lg object-cover" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-label-md text-on-surface">{partner.name}</h3>
        </div>
        <span className="flex items-center gap-1 text-label-sm text-on-surface-variant">
          <Icon name="star" fill className="!text-[14px] text-secondary" />
          {partner.rating}
        </span>
      </div>
    </div>
  )
}

// Generic trade card wrapper.
function TradeCard({ trade, children }) {
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-white p-4">
      <PartnerHeader partner={trade.partner} />
      <div className="grid grid-cols-2 gap-3">
        <CromoChips label="Tú ofreces" stickers={trade.iOffer} />
        <CromoChips label="Recibes" stickers={trade.theyOffer} />
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function Section({ icon, title, hint, children }) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <Icon name={icon} className="!text-[22px] text-primary" />
        <h2 className="text-headline-md text-primary">{title}</h2>
        {hint && <span className="text-label-sm text-on-surface-variant">· {hint}</span>}
      </div>
      {children}
    </section>
  )
}

function EmptyHint({ children }) {
  return (
    <p className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/40 p-4 text-label-md text-on-surface-variant">
      {children}
    </p>
  )
}

// Confirm-state indicator shown on negotiating cards.
function ConfirmIndicator({ iConfirmed, theyConfirmed, partnerName }) {
  return (
    <div className="mt-3 flex items-center gap-4 rounded-lg bg-surface-container-low px-3 py-2">
      <span className={`flex items-center gap-1 text-label-sm font-bold ${iConfirmed ? 'text-primary' : 'text-on-surface-variant'}`}>
        <Icon name={iConfirmed ? 'check_circle' : 'radio_button_unchecked'} fill={iConfirmed} className="!text-[16px]" />
        Tú
      </span>
      <span className={`flex items-center gap-1 text-label-sm font-bold ${theyConfirmed ? 'text-primary' : 'text-on-surface-variant'}`}>
        <Icon name={theyConfirmed ? 'check_circle' : 'radio_button_unchecked'} fill={theyConfirmed} className="!text-[16px]" />
        {partnerName}
      </span>
    </div>
  )
}

function Matches() {
  const {
    pendingReceived,
    pendingSent,
    negotiating,
    completed,
    loading,
    error,
    markSeen,
    accept,
    reject,
  } = useMatches()

  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [contactModal, setContactModal] = useState(null)

  useEffect(() => { markSeen() }, [markSeen])

  if (loading) return <Spinner label="Cargando tus matches" />

  const onAccept = async (id) => {
    setBusyId(id)
    setActionError(null)
    try {
      await accept(id)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const onReject = async (id) => {
    setBusyId(id)
    setActionError(null)
    try {
      await reject(id)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const hasPending = pendingReceived.length > 0 || pendingSent.length > 0

  return (
    <div className="mx-auto max-w-[1100px] px-8 py-10">
      <header className="mb-8">
        <h1 className="text-display-sm font-bold text-primary">Mis Matches</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Invitaciones, negociaciones en curso y trades completados.
        </p>
      </header>

      {error && (
        <p className="mb-6 rounded-lg bg-error-container px-4 py-3 text-label-md text-on-error-container">
          {error}
        </p>
      )}
      {actionError && (
        <p className="mb-6 rounded-lg bg-error-container px-4 py-3 text-label-md text-on-error-container">
          {actionError}
        </p>
      )}

      {/* ── Pendientes ─────────────────────────────────────────────────────── */}
      <Section
        icon="schedule"
        title="Pendientes"
        hint={hasPending ? `${pendingReceived.length} recibidas · ${pendingSent.length} enviadas` : null}
      >
        {!hasPending && (
          <EmptyHint>
            No tienes invitaciones pendientes. Encuentra coleccionistas en el{' '}
            <Link to="/radar" className="font-bold text-primary underline">Radar</Link>{' '}
            y envía una propuesta.
          </EmptyHint>
        )}

        {pendingReceived.length > 0 && (
          <>
            <h3 className="mb-3 text-label-md font-bold text-on-surface-variant">Recibidas</h3>
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              {pendingReceived.map((trade) => (
                <TradeCard key={trade.id} trade={trade}>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onAccept(trade.id)}
                      disabled={busyId === trade.id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-label-md font-bold text-white transition-all hover:bg-primary-container disabled:opacity-50"
                    >
                      <Icon name="check" className="!text-[18px]" />
                      Aceptar
                    </button>
                    <button
                      type="button"
                      onClick={() => onReject(trade.id)}
                      disabled={busyId === trade.id}
                      className="flex items-center justify-center gap-2 rounded-lg border border-outline-variant/40 px-4 py-2.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-50"
                    >
                      Rechazar
                    </button>
                  </div>
                </TradeCard>
              ))}
            </div>
          </>
        )}

        {pendingSent.length > 0 && (
          <>
            <h3 className="mb-3 text-label-md font-bold text-on-surface-variant">Enviadas</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {pendingSent.map((trade) => (
                <TradeCard key={trade.id} trade={trade}>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
                    <span className="text-label-md">
                      Esperando respuesta de{' '}
                      <strong className="text-on-surface">@{trade.partner.username}</strong>
                    </span>
                  </div>
                </TradeCard>
              ))}
            </div>
          </>
        )}
      </Section>

      {/* ── En negociación ─────────────────────────────────────────────────── */}
      <Section
        icon="edit_note"
        title="En negociación"
        hint={negotiating.length ? `${negotiating.length}` : null}
      >
        {negotiating.length === 0 ? (
          <EmptyHint>No tienes negociaciones abiertas.</EmptyHint>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {negotiating.map((trade) => (
              <TradeCard key={trade.id} trade={trade}>
                <ConfirmIndicator
                  iConfirmed={trade.iConfirmed}
                  theyConfirmed={trade.theyConfirmed}
                  partnerName={trade.partner.name}
                />
                <Link
                  to={`/negociacion/${trade.id}`}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-secondary-container py-2.5 text-label-md font-bold text-on-secondary-container transition-all hover:scale-[1.01]"
                >
                  <Icon name="table_view" className="!text-[18px]" />
                  Abrir mesa
                </Link>
              </TradeCard>
            ))}
          </div>
        )}
      </Section>

      {/* ── Completados ────────────────────────────────────────────────────── */}
      <Section
        icon="handshake"
        title="Completados"
        hint={completed.length ? `${completed.length}` : null}
      >
        {completed.length === 0 ? (
          <EmptyHint>Aún no has completado ningún intercambio.</EmptyHint>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {completed.map((trade) => (
              <TradeCard key={trade.id} trade={trade}>
                <button
                  type="button"
                  onClick={() => setContactModal(trade.contact)}
                  disabled={!trade.contact}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-label-md font-bold text-white transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  <Icon name="lock_open" className="!text-[18px]" />
                  Ver contacto
                </button>
              </TradeCard>
            ))}
          </div>
        )}
      </Section>

      <ContactUnlockedModal
        open={contactModal !== null}
        onClose={() => setContactModal(null)}
        partner={contactModal ?? {}}
      />
    </div>
  )
}

export default Matches
