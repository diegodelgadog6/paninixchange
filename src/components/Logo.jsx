import Icon from './Icon'

// Brand wordmark. `variant="light"` is for dark (pitch-green) backgrounds such as
// the sidebar; `variant="dark"` is for the cream surfaces (top nav, footer).
function Logo({ className = '', withIcon = false, variant = 'dark' }) {
  const textColor = variant === 'light' ? 'text-secondary-container' : 'text-primary'

  return (
    <span className={`inline-flex items-center gap-2 font-display font-extrabold tracking-tight ${textColor} ${className}`}>
      {withIcon && <Icon name="sports_soccer" className="text-secondary-container" fill />}
      PaniniXchange
    </span>
  )
}

export default Logo
