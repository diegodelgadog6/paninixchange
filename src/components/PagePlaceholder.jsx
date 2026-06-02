import Icon from './Icon'

// Lightweight stand-in for views that are still being built out in later branches.
// Keeps every route navigable with a non-empty layout (zero console errors).
function PagePlaceholder({ title, icon = 'construction', note = 'Vista en construcción.' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-surface-container-high">
        <Icon name={icon} className="!text-[32px] text-primary" />
      </div>
      <h1 className="font-display text-headline-lg text-primary">{title}</h1>
      <p className="mt-2 text-body-md text-on-surface-variant">{note}</p>
    </div>
  )
}

export default PagePlaceholder
