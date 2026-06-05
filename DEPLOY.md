# Despliegue — PaniniXchange

Arquitectura en producción:

```
Vercel  →  Frontend (React/Vite)
   │  llamadas API (VITE_API_URL)
   ▼
Railway →  Backend (FastAPI)  +  PostgreSQL
```

---

## 1. Base de datos (PostgreSQL en Railway)

1. En Railway, crea un proyecto nuevo → **New → Database → PostgreSQL**.
2. Railway genera la variable `DATABASE_URL` automáticamente. El backend la lee y
   convierte el driver a `asyncpg` solo (ver `server/config.py`).

## 2. Backend (FastAPI en Railway)

1. En el mismo proyecto → **New → GitHub Repo** → selecciona este repo.
2. En **Settings** del servicio:
   - **Root Directory:** `server`  ← importante (el backend vive en esa carpeta).
   - El arranque lo toma de `server/Procfile`
     (`uvicorn main:app --host 0.0.0.0 --port $PORT`).
3. En **Variables**, agrega:
   | Variable | Valor |
   |----------|-------|
   | `DATABASE_URL` | Referencia a la del servicio Postgres (`${{Postgres.DATABASE_URL}}`) |
   | `SECRET_KEY` | Un valor largo y aleatorio (ej. `openssl rand -hex 32`) |
   | `ALLOWED_ORIGINS` | La URL de Vercel (ej. `https://paninixchange.vercel.app`) |
4. Deploy. Al primer arranque, el backend crea las tablas y siembra el catálogo +
   coleccionistas demo automáticamente (ver `lifespan` en `server/main.py`).
5. Copia la URL pública del backend (ej. `https://paninixchange-api.up.railway.app`).

## 3. Frontend (Vercel)

1. En Vercel → **Add New → Project** → importa este repo.
2. Vercel detecta Vite solo (build: `npm run build`, output: `dist`).
3. En **Environment Variables**, agrega:
   | Variable | Valor |
   |----------|-------|
   | `VITE_API_URL` | La URL pública del backend de Railway (paso 2.5) |
4. Deploy. `vercel.json` ya enruta el SPA para que las rutas (`/radar`, etc.) no
   den 404 al recargar.

## 4. Cerrar el círculo (CORS)

Si desplegaste el frontend después del backend, asegúrate de que `ALLOWED_ORIGINS`
en Railway tenga la URL final de Vercel y vuelve a desplegar el backend.

---

## Notas

- **Variables de entorno** = la única diferencia entre dev y prod. En local no
  configuras nada (SQLite + CORS a localhost por defecto).
- No hay migraciones (Alembic) todavía: las tablas se crean en el primer arranque.
  Si más adelante cambian los modelos sobre una base con datos, habrá que añadir
  migraciones para no perder información.
