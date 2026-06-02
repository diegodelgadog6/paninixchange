import Modal from './Modal'
import Icon from './Icon'

// Shown right after a trade is confirmed: the partner's contact is now revealed so
// both collectors can coordinate the in-person swap.
function ContactUnlockedModal({ open, onClose, partner }) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Icon name="lock_open" fill className="!text-[28px] text-primary" />
        </div>
        <h3 className="text-headline-md text-primary">¡Contacto desbloqueado!</h3>
        <p className="mt-1 text-body-md text-on-surface-variant">
          El intercambio fue confirmado. Ya puedes coordinar el encuentro con {partner.name}.
        </p>

        {/* Revealed contact */}
        <div className="mt-5 flex w-full items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-3 text-left">
          <img src={partner.avatar} alt={partner.name} className="h-12 w-12 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-label-md text-primary">{partner.name}</p>
            <p className="truncate text-label-sm text-on-surface-variant">{partner.phone}</p>
          </div>
          <span className="flex items-center gap-1 text-label-sm font-bold text-secondary">
            <Icon name="star" fill className="!text-[16px]" />
            {partner.rating}
          </span>
        </div>

        {/* WhatsApp — href only; the real WhatsApp API integration goes here */}
        <a
          href={`https://wa.me/${partner.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-label-md font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
        >
          <Icon name="chat" fill className="!text-[20px]" />
          Abrir en WhatsApp
        </a>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-lg py-2.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  )
}

export default ContactUnlockedModal
