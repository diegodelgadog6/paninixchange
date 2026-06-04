import Modal from './Modal'
import Icon from './Icon'

// Confirmation step before sealing a trade. Confirming triggers onConfirm, which
// persists the trade and reveals the partner's contact (ContactUnlockedModal).
function ConfirmTradeModal({
  open,
  onClose,
  onConfirm,
  youCount,
  theyCount,
  partner,
  balance,
  confirming = false,
  error = null,
}) {
  return (
    <Modal open={open} onClose={onClose} title="Confirmar intercambio">
      <p className="text-body-md text-on-surface-variant">
        Estás a punto de intercambiar <strong className="text-primary">{youCount}</strong>{' '}
        {youCount === 1 ? 'cromo' : 'cromos'} por <strong className="text-primary">{theyCount}</strong> de{' '}
        <strong className="text-primary">{partner.username}</strong>.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-lg bg-surface-container-low p-3">
        <Icon name="balance" className="text-secondary" />
        <span className="text-label-md text-on-surface">
          Balanza del trato: <strong className="capitalize text-primary">{balance}</strong>
        </span>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-lg border border-secondary-container/40 bg-secondary-container/10 p-3">
        <Icon name="lock_open" className="!text-[20px] shrink-0 text-secondary" />
        <p className="text-label-sm text-on-surface-variant">
          Al confirmar se revelará tu contacto para coordinar el encuentro. Esta acción no se puede deshacer.
        </p>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-error/40 bg-error/10 p-3">
          <Icon name="error" className="!text-[20px] shrink-0 text-error" />
          <p className="text-label-sm text-error">{error}</p>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={confirming}
          className="flex-1 rounded-lg border border-outline-variant/40 py-2.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirming}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary-container py-2.5 text-label-md font-bold text-on-secondary-container shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name={confirming ? 'progress_activity' : 'check'} className={`!text-[20px] ${confirming ? 'animate-spin' : ''}`} />
          {confirming ? 'Confirmando…' : 'Confirmar'}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmTradeModal
