// Thin wrapper around Google's Material Symbols (Outlined) — the icon system used
// throughout the Stitch mockups. Pass `fill` to render the solid/selected variant
// and `weight` to adjust stroke. Size with a Tailwind text-size utility on `className`.
function Icon({ name, className = '', fill = false, weight = 400, style, ...props }) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}`, ...style }}
      {...props}
    >
      {name}
    </span>
  )
}

export default Icon
