import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Spinner from '../components/Spinner'
import ContactUnlockedModal from '../components/ContactUnlockedModal'
import { useNegotiation } from '../hooks/useNegotiation'

// ── Catalog picker ──────────────────────────────────────────────────────────

function CatalogCard({ card, onAdd, busy }) {
  const isSpecial = card.rarity !== 'base'
  return (
    <button
      type="button"
      onClick={() => onAdd(card.code)}
      disabled={busy}
      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all hover:border-primary/40 hover:bg-surface-container-low disabled:opacity-50 ${
        card.useful
          ? 'border-primary/20 bg-primary/5'
          : 'border-outline-variant/20 bg-white'
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${isSpecial ? 'bg-secondary-container' : 'bg-surface-container-high'}`}>
        <span className="text-[10px] font-bold text-on-surface-variant">{card.team}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-label-sm font-bold text-on-surface">{card.name}</p>
        <p className="text-label-sm text-on-surface-variant">#{String(card.number).padStart(3, '0')}</p>
      </div>
      {card.useful && (
        <Icon name="thumb_up" fill className="!text-[16px] shrink-0 text-primary" />
      )}
    </button>
  )
}

function CatalogPicker({ title, cards, onAdd, onClose, busy }) {
  const useful = cards.filter((c) => c.useful)
  const other = cards.filter((c) => !c.useful)
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-lg rounded-t-2xl bg-surface sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-outline-variant/10 px-5 py-4">
          <h3 className="text-headline-sm text-primary">{title}</h3>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <Icon name="close" className="!text-[24px]" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          {cards.length === 0 && (
            <p className="py-8 text-center text-body-md text-on-surface-variant">
              No hay cromos disponibles para añadir.
            </p>
          )}
          {useful.length > 0 && (
            <>
              <p className="mb-2 text-label-sm font-bold text-primary">Le sirven al coleccionista</p>
              <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {useful.map((c) => (
                  <CatalogCard key={c.code} card={c} onAdd={onAdd} busy={busy} />
                ))}
              </div>
            </>
          )}
          {other.length > 0 && (
            <>
              <p className="mb-2 text-label-sm font-bold text-on-surface-variant">Otros repetidos</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {other.map((c) => (
                  <CatalogCard key={c.code} card={c} onAdd={onAdd} busy={busy} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Offer columns ───────────────────────────────────────────────────────────

function OfferItemCard({ item, onRemove, onAccept, onReject, isMine, busy }) {
  const isSpecial = item.rarity === 'gold' || item.rarity === 'legend'
  const isSuggested = item.state === 'suggested'

  return (
    <div className={`group relative rounded-lg border p-3 transition-shadow hover:shadow-md ${
      isSuggested
        ? 'border-dashed border-secondary/40 bg-secondary-container/10'
        : 'border-outline-variant/20 bg-surface-container-lowest shadow-sm'
    }`}>
      {/* Rarity badge */}
      <div className="mb-2 flex items-start justify-between">
        <span className={`rounded px-2 py-0.5 text-label-sm font-bold ${
          isSpecial ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
        }`}>
          {item.team} #{String(item.number).padStart(3, '0')}
        </span>
        {/* Suggested tag */}
        {isSuggested && (
          <span className="rounded border border-secondary/30 px-1.5 py-0.5 text-[9px] font-bold uppercase text-secondary">
            Sugerido
          </span>
        )}
      </div>

      <p className="truncate text-center text-label-md text-on-surface">{item.name}</p>

      {/* Actions */}
      <div className="mt-2 flex gap-2">
        {isMine && !isSuggested && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-1 rounded py-1 text-label-sm text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error disabled:opacity-50"
          >
            <Icon name="close" className="!text-[14px]" />
            Quitar
          </button>
        )}
        {!isMine && isSuggested && (
          <>
            <button
              type="button"
              onClick={() => onAccept(item.id)}
              disabled={busy}
              className="flex flex-1 items-center justify-center gap-1 rounded bg-primary/10 py-1 text-label-sm font-bold text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
            >
              <Icon name="check" className="!text-[14px]" />
              Aceptar
            </button>
            <button
              type="button"
              onClick={() => onReject(item.id)}
              disabled={busy}
              className="flex flex-1 items-center justify-center gap-1 rounded py-1 text-label-sm text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error disabled:opacity-50"
            >
              <Icon name="close" className="!text-[14px]" />
              No
            </button>
          </>
        )}
        {isMine && isSuggested && (
          <button
            type="button"
            onClick={() => onReject(item.id)}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-1 rounded py-1 text-label-sm text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error disabled:opacity-50"
          >
            <Icon name="undo" className="!text-[14px]" />
            Retirar
          </button>
        )}
      </div>
    </div>
  )
}

function OfferColumn({ title, subtitle, items, isMine, onRemove, onAccept, onReject, busy, onAdd, onSuggest }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md text-primary">{title}</h2>
        <div className="flex items-center gap-2">
          {subtitle && <span className="text-label-sm text-on-surface-variant">{subtitle}</span>}
          <span className="rounded bg-surface-container-high px-2 py-1 text-label-sm">
            {items.filter(i => i.state === 'committed').length} cromos
          </span>
        </div>
      </div>

      <div className="min-h-[400px] rounded-xl border-2 border-dashed border-outline-variant/30 p-3">
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <OfferItemCard
              key={item.id}
              item={item}
              isMine={isMine}
              onRemove={onRemove}
              onAccept={onAccept}
              onReject={onReject}
              busy={busy}
            />
          ))}
        </div>

        {items.length === 0 && (
          <div className="flex h-48 items-center justify-center">
            <p className="text-body-md text-on-surface-variant">
              {isMine ? 'Añade tus cromos repetidos' : 'Sugiere cromos del coleccionista'}
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={isMine ? onAdd : onSuggest}
        disabled={busy}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-outline-variant/40 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:opacity-50"
      >
        <Icon name={isMine ? 'add' : 'lightbulb'} className="!text-[18px]" />
        {isMine ? 'Añadir cromo' : 'Sugerir cromo'}
      </button>
    </div>
  )
}

// ── Balance indicator ───────────────────────────────────────────────────────

const RARITY_PTS = { legend: 5, gold: 4, base: 2 }

function computeBalance(myOffer, theirOffer) {
  const sum = (items) => items
    .filter(i => i.state === 'committed')
    .reduce((acc, i) => acc + (RARITY_PTS[i.rarity] ?? 0), 0)
  const diff = sum(theirOffer) - sum(myOffer)
  if (diff >= 2) return 'favorable'
  if (diff <= -2) return 'sacrificio'
  return 'justo'
}

function BalanceChip({ balance }) {
  const cfg = {
    favorable: { label: 'Favorable', cls: 'bg-primary/10 text-primary' },
    sacrificio: { label: 'Sacrificio', cls: 'bg-error/10 text-error' },
    justo: { label: 'Justo', cls: 'bg-secondary-container/30 text-secondary' },
  }[balance] ?? { label: '—', cls: 'bg-surface-container text-on-surface-variant' }
  return (
    <span className={`rounded-full px-3 py-1 text-label-sm font-bold ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

// ── Confirm bar ─────────────────────────────────────────────────────────────

function ConfirmBar({ iConfirmed, theyConfirmed, partnerName, onConfirm, onUnconfirm, busy, canConfirm }) {
  const bothConfirmed = iConfirmed && theyConfirmed
  return (
    <div className="fixed bottom-0 left-64 right-0 z-30 border-t border-outline-variant/10 bg-surface/95 px-12 py-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-6">
        {/* Status indicators */}
        <div className="flex items-center gap-6">
          <span className={`flex items-center gap-1.5 text-label-md font-bold ${iConfirmed ? 'text-primary' : 'text-on-surface-variant'}`}>
            <Icon name={iConfirmed ? 'check_circle' : 'radio_button_unchecked'} fill={iConfirmed} className="!text-[18px]" />
            Tú
          </span>
          <span className={`flex items-center gap-1.5 text-label-md font-bold ${theyConfirmed ? 'text-primary' : 'text-on-surface-variant'}`}>
            <Icon name={theyConfirmed ? 'check_circle' : 'radio_button_unchecked'} fill={theyConfirmed} className="!text-[18px]" />
            {partnerName}
          </span>
          {bothConfirmed && (
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/matches"
            className="rounded-lg border border-outline-variant/40 px-6 py-3 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            Volver
          </Link>
          {iConfirmed ? (
            <button
              type="button"
              onClick={onUnconfirm}
              disabled={busy}
              className="flex items-center gap-2 rounded-lg border border-outline-variant/40 px-6 py-3 text-label-md text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error disabled:opacity-50"
            >
              <Icon name="undo" className="!text-[18px]" />
              Cancelar confirmación
            </button>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy || !canConfirm}
              className="flex items-center gap-2 rounded-lg bg-secondary-container px-12 py-3 text-label-md font-bold text-on-secondary-container shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name={busy ? 'progress_activity' : 'handshake'} className={`!text-[20px] ${busy ? 'animate-spin' : ''}`} />
              Confirmar intercambio
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Not-found / wrong-state notice ──────────────────────────────────────────

function NegotiationNotice({ icon, title, children }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface-container-low px-6 text-center">
      <Icon name={icon} className="!text-[48px] text-outline-variant" />
      <h2 className="text-headline-md text-primary">{title}</h2>
      <p className="max-w-sm text-body-md text-on-surface-variant">{children}</p>
      <Link
        to="/matches"
        className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-label-md text-white transition-all hover:bg-primary-container"
      >
        <Icon name="swap_horiz" className="!text-[18px]" />
        Ir a Mis Matches
      </Link>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

function Negociacion() {
  const { tradeId } = useParams()
  const [contactDismissed, setContactDismissed] = useState(false)
  const {
    trade,
    catalog,
    catalogOpen,
    loading,
    error,
    busy,
    actionError,
    openCatalog,
    closeCatalog,
    addItem,
    removeItem,
    suggestItem,
    acceptSugg,
    rejectSugg,
    confirm,
    unconfirm,
  } = useNegotiation(tradeId)

  if (!tradeId) {
    return (
      <NegotiationNotice icon="swap_horiz" title="Ninguna mesa abierta">
        Elige un intercambio en Mis Matches para abrir la mesa de negociación.
      </NegotiationNotice>
    )
  }

  if (loading) return <Spinner label="Cargando mesa de negociación" />

  if (error) {
    return (
      <NegotiationNotice icon="error" title="No se pudo cargar la mesa">
        {error}
      </NegotiationNotice>
    )
  }

  if (!trade) return null

  if (trade.status === 'completed') {
    const collectorAvatar = (name) =>
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ece8e0&color=00241a&bold=true&size=96`
    const contact = trade.contact
      ? { ...trade.contact, avatar: collectorAvatar(trade.contact.name) }
      : null
    return (
      <>
        <NegotiationNotice icon="handshake" title="¡Intercambio completado!">
          El intercambio con {trade.partner?.name} fue completado. Puedes ver el contacto en Mis Matches.
        </NegotiationNotice>
        {contact && (
          <ContactUnlockedModal
            open={!contactDismissed}
            onClose={() => setContactDismissed(true)}
            partner={contact}
          />
        )}
      </>
    )
  }

  if (trade.status === 'pending') {
    return (
      <NegotiationNotice icon="schedule" title="Invitación pendiente">
        Esperando a que el coleccionista acepte la invitación antes de abrir la mesa.
      </NegotiationNotice>
    )
  }

  if (trade.status !== 'negotiating') {
    return (
      <NegotiationNotice icon="cancel" title="Intercambio no disponible">
        Este intercambio ya no está activo.
      </NegotiationNotice>
    )
  }

  const myOffer = trade.my_offer ?? []
  const theirOffer = trade.their_offer ?? []
  const balance = computeBalance(myOffer, theirOffer)
  const canConfirm =
    myOffer.filter(i => i.state === 'committed').length > 0 &&
    theirOffer.filter(i => i.state === 'committed').length > 0

  const handleCatalogAdd = async (code) => {
    if (catalogOpen === 'mine') await addItem(code)
    else await suggestItem(code)
    closeCatalog()
  }

  const partnerName = trade.partner?.name ?? 'Socio'
  const iConfirmed = trade.i_confirmed ?? false
  const theyConfirmed = trade.they_confirmed ?? false

  return (
    <div className="pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-outline-variant/10 bg-surface/95 px-12 backdrop-blur-md">
        <div>
          <h1 className="text-headline-md font-bold text-primary">Mesa de Negociación</h1>
          <p className="text-label-sm text-on-surface-variant">con {partnerName}</p>
        </div>
        <BalanceChip balance={balance} />
      </header>

      {actionError && (
        <div className="mx-auto max-w-[1280px] px-12 pt-4">
          <p className="rounded-lg bg-error-container px-4 py-3 text-label-md text-on-error-container">
            {actionError}
          </p>
        </div>
      )}

      <div className="mx-auto max-w-[1280px] p-12">
        <div className="grid grid-cols-12 items-start gap-6">
          {/* Tu oferta */}
          <div className="col-span-12 lg:col-span-5">
            <OfferColumn
              title="Tú ofreces"
              items={myOffer}
              isMine
              onRemove={removeItem}
              onAccept={acceptSugg}
              onReject={rejectSugg}
              busy={busy}
              onAdd={() => openCatalog('mine')}
            />
          </div>

          {/* Divisor */}
          <div className="relative col-span-12 flex flex-col items-center justify-center py-8 lg:col-span-2">
            <div className="absolute hidden h-full w-px bg-outline-variant/20 lg:block" />
            <Icon name="swap_horiz" className="!text-[40px] text-outline-variant" />
          </div>

          {/* Oferta del socio */}
          <div className="col-span-12 lg:col-span-5">
            <OfferColumn
              title="Ellos ofrecen"
              subtitle={`@${trade.partner?.username}`}
              items={theirOffer}
              isMine={false}
              onRemove={removeItem}
              onAccept={acceptSugg}
              onReject={rejectSugg}
              busy={busy}
              onSuggest={() => openCatalog('theirs')}
            />
          </div>
        </div>
      </div>

      {/* Catalog picker overlay */}
      {catalogOpen && catalog && (
        <CatalogPicker
          title={catalogOpen === 'mine' ? 'Añadir a tu oferta' : 'Sugerir al coleccionista'}
          cards={catalogOpen === 'mine' ? (catalog.my_spares ?? []) : (catalog.their_spares ?? [])}
          onAdd={handleCatalogAdd}
          onClose={closeCatalog}
          busy={busy}
        />
      )}

      {/* Fixed confirm bar */}
      <ConfirmBar
        iConfirmed={iConfirmed}
        theyConfirmed={theyConfirmed}
        partnerName={partnerName}
        onConfirm={confirm}
        onUnconfirm={unconfirm}
        busy={busy}
        canConfirm={canConfirm}
      />
    </div>
  )
}

export default Negociacion
