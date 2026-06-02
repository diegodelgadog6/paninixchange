# PaniniXchange

> La red social del coleccionista del Mundial 2026.

Plataforma web (desktop) que conecta coleccionistas cercanos para intercambiar
cromos Panini del Mundial 2026 de forma **inteligente, segura y rápida**.

Este repositorio contiene el **shell de frontend** de la aplicación: una interfaz
completamente navegable y visualmente terminada, construida con datos de ejemplo
(mock). No incluye backend, autenticación ni llamadas reales a API — todo el
estado es local y simulado.

## Tech stack

- **React 19** + **Vite 8**
- **Tailwind CSS 4** (design tokens vía `@theme`)
- **React Router 7** (`react-router-dom`)

## Vistas

| Ruta            | Descripción                                            |
| --------------- | ------------------------------------------------------ |
| `/`             | Landing con hero, stats (994 · <1 min · GPS) y CTA     |
| `/dashboard`    | Home del coleccionista: progreso, stats y matches      |
| `/album`        | Álbum digital: grilla de 994 cromos, filtros, búsqueda |
| `/radar`        | Radar de coleccionistas cercanos (mapa + lista)        |
| `/negociacion`  | Mesa de negociación con balanza de equilibrio          |
| `/perfil`       | Perfil del coleccionista: reputación, historial, insignias |
| `/premium`      | Página de suscripción (placeholder Stripe)             |

## Desarrollo

```bash
npm install
npm run dev
```

## Integraciones futuras (no implementadas)

- **Google Maps API** → contenedor `<div id="map">` en `/radar`, listo para recibir el mapa.
- **WhatsApp API** → botón "Abrir en WhatsApp" en el modal de contacto desbloqueado.
- **Stripe API** → página `/premium` con tarjeta de precios y botón "Suscribirse".

---

Proyecto académico · Construcción de Software · Mundial 2026.
