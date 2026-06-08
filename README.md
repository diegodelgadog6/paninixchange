# PaniniXchange

> La red social del coleccionista del Mundial 2026.

Plataforma web que conecta coleccionistas cercanos para intercambiar cromos Panini
del Mundial 2026 de forma **inteligente, segura y rápida**. Aplicación full-stack con
autenticación real, API REST, base de datos y emparejamiento automático de intercambios.

## 🌐 Despliegue en producción

| Servicio | URL |
| --- | --- |
| **Frontend (Vercel)** | https://paninixchange.vercel.app |
| **Backend (Railway)** | https://paninixchange-production.up.railway.app |

## Tech stack

**Frontend**
- React 19 + Vite
- Tailwind CSS 4 (design tokens vía `@theme`)
- React Router 7

**Backend**
- Python + FastAPI (async)
- SQLModel (SQLAlchemy + Pydantic)
- PostgreSQL (producción) · SQLite (desarrollo)
- Autenticación con JWT + bcrypt

## Los 5 flujos de negocio

1. **Autenticación y Registro** — cuentas, login y sesión con JWT.
2. **Gestión del Álbum** — registro de copias de los 994 cromos.
3. **Radar de Coincidencias** — emparejamiento de coleccionistas compatibles.
4. **Intercambio (Negociación)** — invitación, negociación y cierre con confirmación mutua.
5. **Reputación** — reseñas, rating, puntos, niveles e insignias.

## APIs de terceros

- **Stripe** — suscripciones Pro/Leyenda.
- **Resend** — correos del formulario de soporte.
- **Leaflet / OpenStreetMap** + **Geolocalización** — mapa del Radar y distancias.

## Vistas

| Ruta                  | Descripción                                            |
| --------------------- | ------------------------------------------------------ |
| `/`                   | Landing con hero, stats (994 · <1 min · GPS) y CTA     |
| `/login`, `/register` | Autenticación de coleccionistas                        |
| `/dashboard`          | Home del coleccionista: progreso, stats y matches      |
| `/album`              | Álbum digital: grilla de 994 cromos, filtros, búsqueda |
| `/radar`              | Radar de coleccionistas cercanos (mapa + lista)        |
| `/negociacion/:id`    | Mesa de negociación con balanza de equilibrio          |
| `/matches`            | Bandeja de intercambios (pendientes, en curso, hechos) |
| `/perfil`             | Perfil: reputación, historial, insignias               |
| `/premium`            | Suscripción (Stripe)                                   |

## Estructura del repositorio

```
src/                        Frontend React (pages, components, context, hooks, lib)
server/                     Backend FastAPI (routers, models, schemas, matching, reputation)
ENTREGABLES DEL PROYECTO/   Documentación del proyecto (.docx) y guía de despliegue
```

## Desarrollo

**Frontend**
```bash
npm install
npm run dev
```

**Backend**
```bash
cd server
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Sin configuración extra, el backend usa SQLite local. Las variables de entorno
(`DATABASE_URL`, `SECRET_KEY`, `ALLOWED_ORIGINS`, claves de Stripe/Resend) solo se
necesitan en producción — ver la guía de despliegue.

## Entregables

La documentación del proyecto está en la carpeta
[ENTREGABLES DEL PROYECTO/](ENTREGABLES%20DEL%20PROYECTO):

- [01-Flujos-de-Negocio.docx](ENTREGABLES%20DEL%20PROYECTO/01-Flujos-de-Negocio.docx) — los 5 flujos de negocio.
- [02-Arquitectura.docx](ENTREGABLES%20DEL%20PROYECTO/02-Arquitectura.docx) — arquitectura de la solución.
- [03-Modelo-de-Datos.docx](ENTREGABLES%20DEL%20PROYECTO/03-Modelo-de-Datos.docx) — modelo relacional y diccionario de datos.
- [DEPLOY.md](ENTREGABLES%20DEL%20PROYECTO/DEPLOY.md) — guía de despliegue.

> El video de demostración (YouTube, máx. 8 min) se entrega por separado.

---

Proyecto académico · Construcción de Software · Mundial 2026.
