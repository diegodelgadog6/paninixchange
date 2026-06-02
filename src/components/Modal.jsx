import { useEffect } from 'react'
import Icon from './Icon'

// Base modal: soft pitch-green backdrop with blur (per DESIGN.md), centered card,
// closes on backdrop click or Escape. Used by the trade / contact / rating modals.
function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full ${maxWidth} rounded-2xl bg-white p-6 shadow-2xl`}>
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-headline-md text-primary">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="text-on-surface-variant transition-colors hover:text-primary"
            >
              <Icon name="close" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default Modal
