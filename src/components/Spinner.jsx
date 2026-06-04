// Centered loading spinner shown while async data (auth, collection) hydrates.
function Spinner({ label = 'Cargando' }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-low">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
        role="status"
        aria-label={label}
      />
    </div>
  )
}

export default Spinner
