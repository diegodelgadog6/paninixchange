import { useState } from 'react'
import Modal from './Modal'
import StarRating from './StarRating'
import Icon from './Icon'

// Mutual rating after a completed trade. `onSubmit({ rating, comment })` performs the
// POST /api/reviews (provided by the parent) and may be async; the modal shows a
// submitting state and surfaces any error.
function RatingModal({ open, onClose, partner = 'el coleccionista', onSubmit }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const reset = () => {
    setRating(0)
    setComment('')
    setDone(false)
    setSubmitting(false)
    setError(null)
  }
  const handleClose = () => {
    onClose?.()
    reset()
  }
  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit?.({ rating, comment })
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={done ? undefined : `Calificar a ${partner}`}>
      {done ? (
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Icon name="check_circle" fill className="!text-[28px] text-primary" />
          </div>
          <h3 className="text-headline-md text-primary">¡Gracias por tu reseña!</h3>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Tu calificación ayuda a mantener la comunidad confiable.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-5 w-full rounded-lg bg-primary py-2.5 text-label-md text-white transition-colors hover:bg-primary-container"
          >
            Cerrar
          </button>
        </div>
      ) : (
        <>
          <p className="text-body-md text-on-surface-variant">¿Cómo fue tu intercambio?</p>

          <div className="my-5 flex justify-center">
            <StarRating value={rating} interactive onChange={setRating} starClass="!text-[40px]" />
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Cuéntale a la comunidad cómo fue (opcional)…"
            className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-low p-3 text-body-md focus:border-primary-container focus:outline-none"
          />

          {error && <p className="mt-3 text-label-sm text-error">{error}</p>}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg border border-outline-variant/40 py-2.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={rating === 0 || submitting}
              className="flex-1 rounded-lg bg-secondary-container py-2.5 text-label-md font-bold text-on-secondary-container shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Enviando…' : 'Enviar reseña'}
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}

export default RatingModal
