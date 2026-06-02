// Curated match suggestions shown on the dashboard ("Sugerencias de Match").
// Real app: GET /api/matches — compatibility is computed server-side by the
// matching engine (overlap between this collector's duplicates and another's needs).
const avatar = (name, bg = '0d3b2e') =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&bold=true&size=96`

export const matchSuggestions = [
  {
    id: 'm-01',
    name: 'Marco Silva',
    avatar: avatar('Marco Silva'),
    compatibility: 95,
    description: 'Tiene 14 cromos que te faltan. Buscas 3 de los suyos.',
  },
  {
    id: 'm-02',
    name: 'Elena Torres',
    avatar: avatar('Elena Torres', '745b00'),
    compatibility: 88,
    description: 'Tiene 8 cromos que te faltan. Incluyendo 2 Oro.',
  },
  {
    id: 'm-03',
    name: 'Javier López',
    avatar: avatar('Javier Lopez', '0d3b2e'),
    compatibility: 82,
    description: 'Tiene el Emblema Brasil que tanto buscas.',
  },
]
