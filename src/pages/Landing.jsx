import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import Icon from '../components/Icon'

const STATS = [
  { value: '994', label: 'cromos' },
  { value: '< 1 min', label: 'para match' },
  { value: 'GPS', label: 'activo', icon: 'location_on' },
]

// Mini album illustration used inside the "Digital Album Scanner" feature card.
// Self-contained (CSS only) so there are no external image dependencies.
function AlbumIllustration() {
  const slots = [
    'filled', 'filled', 'empty', 'gold',
    'filled', 'empty', 'filled', 'filled',
    'gold', 'filled', 'filled', 'empty',
  ]
  const styles = {
    filled: 'bg-primary-container border-primary-container',
    gold: 'bg-secondary-container border-secondary-fixed-dim',
    empty: 'bg-surface-container border border-dashed border-outline-variant',
  }
  return (
    <div className="h-full rounded-lg bg-surface-container-low border border-outline-variant/20 p-4">
      <div className="grid h-full grid-cols-4 gap-2">
        {slots.map((s, i) => (
          <div key={i} className={`aspect-[3/4] rounded ${styles[s]} flex items-center justify-center`}>
            {s !== 'empty' && (
              <Icon name="person" fill className="!text-[18px] text-white/70" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Landing() {
  const heroRef = useRef(null)

  // Subtle mouse parallax on the decorative pitch circles (matches the Stitch hero).
  useEffect(() => {
    const onMove = (e) => {
      const circles = heroRef.current?.querySelectorAll('.pitch-circle') ?? []
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      circles.forEach((circle, index) => {
        const speed = (index + 1) * 12
        circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      <TopNav />

      <main className="pt-20">
        {/* ===== Hero ===== */}
        <section
          ref={heroRef}
          className="hero-pattern relative flex min-h-[760px] flex-col items-center justify-center px-12 text-center"
        >
          <div className="soccer-pitch-circles">
            <div className="pitch-circle -top-20 -left-20 h-[600px] w-[600px]" />
            <div className="pitch-circle -right-20 bottom-10 h-[400px] w-[400px]" />
            <div className="pitch-circle left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
            <div className="mb-8 animate-bounce">
              <Icon name="sports_soccer" fill className="!text-[64px] text-secondary-container" />
            </div>
            <h1 className="mb-4 font-display text-display-lg tracking-tight text-white">
              La red social del coleccionista del{' '}
              <span className="text-secondary-container">Mundial 2026</span>
            </h1>
            <p className="mb-8 max-w-2xl text-body-lg text-on-primary-container opacity-90">
              Smart Swap. Real People. El intercambio de cromos elevado al siguiente nivel.
            </p>
            <Link
              to="/dashboard"
              className="rounded-lg bg-secondary-container px-10 py-5 font-display text-headline-md text-primary transition-all hover:shadow-xl hover:shadow-secondary-container/20 active:scale-[0.98]"
            >
              Empieza a intercambiar
            </Link>
          </div>

          {/* Stats overlay */}
          <div className="absolute -bottom-16 left-1/2 w-full max-w-[1280px] -translate-x-1/2 px-4">
            <div className="grid grid-cols-1 divide-y divide-outline-variant/20 overflow-hidden rounded-xl border border-outline-variant/10 bg-white shadow-xl md:grid-cols-3 md:divide-x md:divide-y-0">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center justify-center py-8">
                  <div className="mb-1 flex items-center gap-2">
                    {stat.icon && (
                      <Icon name={stat.icon} className="text-secondary" weight={600} />
                    )}
                    <span className="font-display text-display-lg tracking-tighter text-primary">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-label-md uppercase tracking-widest text-on-surface-variant">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Process / How it works ===== */}
        <section className="bg-surface-container-low px-12 pb-20 pt-48">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
              <div className="max-w-xl">
                <span className="mb-3 block text-label-md uppercase tracking-[0.2em] text-secondary">
                  El Proceso
                </span>
                <h2 className="text-headline-lg text-primary">
                  Una experiencia editorial para el coleccionista moderno
                </h2>
              </div>
              <p className="max-w-md text-body-lg text-on-surface-variant">
                Digitalizamos la nostalgia del álbum físico integrando algoritmos de
                emparejamiento inteligente y geolocalización segura.
              </p>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              {/* Feature 1 */}
              <div className="group rounded-xl border border-outline-variant/20 bg-white p-12 transition-all hover:border-primary/20 md:col-span-8">
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="flex-1">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-container">
                      <Icon name="menu_book" className="text-white" />
                    </div>
                    <h3 className="mb-2 text-headline-md text-primary">Digital Album Scanner</h3>
                    <p className="mb-8 text-body-md text-on-surface-variant">
                      Sube tu inventario en segundos. Nuestra IA reconoce cada jugador y número,
                      creando tu perfil de coleccionista verificado de forma instantánea.
                    </p>
                    <ul className="space-y-3">
                      {['Escaneo OCR de alta precisión', 'Actualización en tiempo real'].map((t) => (
                        <li key={t} className="flex items-center gap-3 text-label-md text-on-surface">
                          <Icon name="check_circle" className="!text-[20px] text-secondary" fill />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <AlbumIllustration />
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col justify-between rounded-xl bg-primary-container p-12 text-white md:col-span-4">
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-container">
                    <Icon name="radar" className="text-primary" />
                  </div>
                  <h3 className="mb-2 text-headline-md text-secondary-container">Trade Radar</h3>
                  <p className="text-body-md text-on-primary-container">
                    Encuentra coleccionistas a la vuelta de la esquina. Filtramos por distancia y
                    coincidencia de cromos faltantes.
                  </p>
                </div>
                <div className="mt-8 border-t border-white/10 pt-8">
                  <div className="mb-4 flex -space-x-3">
                    {['Ana Ruiz', 'Leo Paz', 'Sara Gil'].map((n) => (
                      <img
                        key={n}
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=a3d0be&color=00241a&bold=true&size=64`}
                        alt={n}
                        className="h-10 w-10 rounded-full border-2 border-primary-container object-cover"
                      />
                    ))}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-container bg-surface-dim text-label-sm font-bold text-primary">
                      +12
                    </div>
                  </div>
                  <p className="text-label-sm text-on-primary-container">
                    Coleccionistas activos cerca de ti
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl border border-outline-variant/20 bg-white p-12 transition-all hover:border-secondary/30 md:col-span-4">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-high">
                  <Icon name="handshake" className="text-primary" />
                </div>
                <h3 className="mb-2 text-headline-md text-primary">Verified Swaps</h3>
                <p className="text-body-md text-on-surface-variant">
                  Sistema de reputación y puntos de encuentro seguros. Cambia con confianza y
                  completa tu álbum sin riesgos.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="relative flex items-center overflow-hidden rounded-xl bg-surface-container-high p-12 md:col-span-8">
                <div className="relative z-10 md:w-1/2">
                  <h3 className="mb-2 text-headline-md text-primary">Mundial 2026 Edition</h3>
                  <p className="mb-4 text-body-md text-on-surface-variant">
                    Acceso exclusivo a cromos especiales, leyendas y ediciones limitadas del torneo
                    más grande de la historia.
                  </p>
                  <Link to="/album" className="group flex items-center gap-2 text-label-md text-primary">
                    Ver catálogo completo
                    <Icon name="arrow_forward" className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <div className="absolute bottom-0 right-0 top-0 hidden w-1/2 md:block">
                  <div className="grid h-full grid-cols-2 gap-2 p-4">
                    <div className="aspect-square rounded-lg border border-white bg-white/50" />
                    <div className="flex aspect-square items-center justify-center rounded-lg border border-outline-variant/20 bg-white shadow-sm">
                      <span className="font-display text-display-lg text-primary opacity-20">26</span>
                    </div>
                    <div className="aspect-square rounded-lg border border-secondary-container/30 bg-secondary-container/20" />
                    <div className="aspect-square rounded-lg border border-primary/10 bg-primary/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="bg-surface px-12 py-24">
          <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-2xl bg-primary-container p-16">
            <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-secondary-container/10 blur-[100px]" />
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-headline-lg text-white">¿Listo para completar tu colección?</h2>
              <p className="mb-8 text-body-lg text-on-primary-container">
                Únete a miles de coleccionistas y experimenta la forma más eficiente y segura de
                intercambiar cromos.
              </p>
              <div className="flex flex-col justify-center gap-6 md:flex-row">
                <Link
                  to="/dashboard"
                  className="rounded-lg bg-secondary-container px-8 py-4 text-label-md text-primary transition-all hover:bg-secondary-fixed active:scale-[0.98]"
                >
                  Empieza Gratis Hoy
                </Link>
                <Link
                  to="/dashboard"
                  className="rounded-lg border border-on-primary-container px-8 py-4 text-label-md text-white transition-all hover:bg-white/5"
                >
                  Ver Tutorial
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Landing
