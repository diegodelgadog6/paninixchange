# Documentación — PaniniXchange

Entregables de documentación del proyecto. Los documentos están en formato `.docx`.

| # | Documento | Contenido |
|---|-----------|-----------|
| 1 | [01-Flujos-de-Negocio.docx](01-Flujos-de-Negocio.docx) | Los 5 flujos de negocio (Auth, Álbum, Radar, Intercambio, Reputación): objetivo, actores, tablas, endpoints, reglas de negocio y recorrido paso a paso. Incluye las APIs de terceros usadas. |
| 2 | [02-Arquitectura.docx](02-Arquitectura.docx) | Arquitectura de la solución: stack, capas del frontend y backend, patrones, despliegue y seguridad. |
| 3 | [03-Modelo-de-Datos.docx](03-Modelo-de-Datos.docx) | Modelo relacional, diccionario de datos de las 6 tablas, relaciones e integridad referencial. |

## Despliegue en producción

- **Frontend (Vercel):** https://paninixchange.vercel.app
- **Backend (Railway):** https://paninixchange-production.up.railway.app

## Los 5 flujos de negocio

1. **Autenticación y Registro** — cuentas, login y sesión con JWT.
2. **Gestión del Álbum** — registro de copias de los 994 cromos.
3. **Radar de Coincidencias** — emparejamiento de coleccionistas compatibles.
4. **Intercambio (Negociación)** — invitación, negociación y cierre con confirmación mutua.
5. **Reputación** — reseñas, rating, puntos, niveles e insignias.

> El video de demostración (YouTube, máx. 8 min) se entrega por separado.
