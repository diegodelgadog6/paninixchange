import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import StickerCard from '../components/StickerCard'
import { useCollection } from '../context/CollectionContext'
import { COUNTRY_NAMES, SPECIAL_SECTIONS } from '../data/catalog'

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'tengo', label: 'Tengo' },
  { key: 'falta', label: 'Me falta' },
  { key: 'repetido', label: 'Repetido' },
]

// Selección filter options: all → no filter, especiales → grouped special sections,
// then the 48 national teams sorted alphabetically by Spanish name.
const TEAM_OPTIONS = [
  { value: 'todas', label: 'Todas las selecciones' },
  { value: 'especiales', label: 'Especiales (FWC · 00 · Coca-Cola)' },
  ...Object.entries(COUNTRY_NAMES)
    .map(([code, name]) => ({ value: code, label: name }))
    .sort((a, b) => a.label.localeCompare(b.label, 'es')),
]

const STATUS_PILL = {
  tengo: { label: 'Tengo', cls: 'bg-primary/10 text-primary' },
  repetido: { label: 'Repetido', cls: 'bg-secondary-container text-primary' },
  falta: { label: 'Me falta', cls: 'bg-error/10 text-error' },
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  )
}

function StatusPill({ status }) {
  const p = STATUS_PILL[status] ?? STATUS_PILL.falta
  return <span className={`rounded px-2 py-0.5 text-label-sm font-bold ${p.cls}`}>{p.label}</span>
}

function Album() {
  const { stickers, stats, addCopy, removeCopy } = useCollection()
  const [filter, setFilter] = useState('todos')
  const [team, setTeam] = useState('todas')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return stickers.filter((s) => {
      if (filter !== 'todos' && s.status !== filter) return false
      if (team === 'especiales' && !SPECIAL_SECTIONS.includes(s.team)) return false
      if (team !== 'todas' && team !== 'especiales' && s.team !== team) return false
      if (!q) return true
      return (
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.team.toLowerCase().includes(q) ||
        `${s.team} ${s.number}`.toLowerCase().includes(q)
      )
    })
  }, [stickers, filter, team, search])

  const progress = Math.round((stats.owned / stats.total) * 100)
  const tableRows = filtered.slice(0, 10)

  return (
    <div>
      {/* Sticky top bar: search + filters + progress */}
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-6 border-b border-outline-variant/10 bg-surface/95 px-12 backdrop-blur-md">
        <div className="flex flex-1 items-center gap-6">
          <div className="group relative w-full max-w-md">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Busca por jugador o código (ej. ARG17)"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2 pl-10 pr-4 text-body-md transition-all focus:border-primary-container focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`rounded-lg px-4 py-2 text-label-md transition-all ${
                  filter === f.key
                    ? 'bg-primary-container font-semibold text-white'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-outline-variant/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {/* Selección filter (countries + especiales) */}
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className={`rounded-lg border border-outline-variant bg-surface-container-high px-3 py-2 text-label-md transition-all focus:border-primary-container focus:outline-none ${
              team !== 'todas' ? 'font-semibold text-primary' : 'text-on-surface-variant'
            }`}
          >
            {TEAM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-6 flex flex-col items-end">
          <span className="text-label-md font-bold text-primary">
            {stats.owned} / {stats.total}
          </span>
          <span className="text-label-sm text-on-surface-variant">{progress}% Completo</span>
        </div>
      </header>

      <div className="px-12 py-8">
        {/* Section header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-headline-lg tracking-tight text-primary">Álbum Mundial 2026</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Mostrando {filtered.length.toLocaleString('es')} de {stats.total.toLocaleString('es')} cromos
              {filter !== 'todos' && ` · ${FILTERS.find((f) => f.key === filter).label}`}
              {team !== 'todas' && ` · ${TEAM_OPTIONS.find((o) => o.value === team).label}`}
            </p>
          </div>
          <div className="flex items-center gap-4 text-label-sm text-on-surface-variant">
            <Legend color="bg-primary" label={`Tengo ${stats.tengo}`} />
            <Legend color="bg-secondary-container" label={`Repetidos ${stats.repetido}`} />
            <Legend color="bg-error" label={`Faltan ${stats.falta}`} />
          </div>
        </div>

        {/* 6-column sticker grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant/40 py-24 text-center">
            <Icon name="search_off" className="!text-[40px] text-outline" />
            <p className="mt-3 text-body-md text-on-surface-variant">
              Ningún cromo coincide con tu búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filtered.map((sticker) => (
              <StickerCard
                key={sticker.id}
                sticker={sticker}
                onAdd={() => addCopy(sticker.id)}
                onRemove={() => removeCopy(sticker.id)}
              />
            ))}
          </div>
        )}

        {/* Inventory detail table (zebra striped) */}
        {tableRows.length > 0 && (
          <section className="mt-12 overflow-hidden rounded-xl border border-outline-variant/10 bg-surface-container-lowest">
            <div className="flex items-center justify-between border-b border-outline-variant/10 px-6 py-4">
              <h3 className="text-headline-md text-primary">Estadísticas de Inventario</h3>
              <span className="text-label-sm text-on-surface-variant">
                Primeros {tableRows.length} de {filtered.length.toLocaleString('es')}
              </span>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                  <th className="px-6 py-3 font-semibold">Cromo</th>
                  <th className="px-6 py-3 font-semibold">Jugador</th>
                  <th className="px-6 py-3 font-semibold">Equipo</th>
                  <th className="px-6 py-3 font-semibold">Posición</th>
                  <th className="px-6 py-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((s, i) => (
                  <tr key={s.id} className={i % 2 === 1 ? 'bg-primary/5' : ''}>
                    <td className="px-6 py-3 font-bold text-primary">{s.id}</td>
                    <td className="px-6 py-3 text-on-surface">{s.name}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{s.team}</td>
                    <td className="px-6 py-3 text-on-surface-variant">{s.position}</td>
                    <td className="px-6 py-3">
                      <StatusPill status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  )
}

export default Album
