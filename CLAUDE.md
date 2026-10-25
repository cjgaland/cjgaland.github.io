# CLAUDE.md — Portal del ecosistema

> Documento común a todas las apps (lista, carpetas, identidad visual e intercambio de datos): `/Users/Trabajo/Desktop/Calidad&Seguridad/Ecosistema Calidad/ECOSISTEMA.md`.

Responder siempre en español y en lenguaje claro (el autor no es programador). El diseño está en `/Users/Trabajo/Desktop/Calidad&Seguridad/Ecosistema Calidad/Portal/Diseño/DISEÑO_PORTAL.md` (léelo al empezar).

## 1. Descripción
Página de entrada (PWA estática, sin dependencias) que presenta todas las apps de calidad y seguridad del paciente agrupadas por ámbito, el mapa de cómo encajan y la Guía. Se publicará en la **raíz** https://cjgaland.github.io/ (repositorio `cjgaland/cjgaland.github.io`). Es el destino del QR del cartel (`../Diseño/qr-portal.svg`, generado con `../Diseño/generar_qr.py`).

Autoría: un único bloque `<div id="autoria">` en el pie de `index.html` (Área de Calidad y Seguridad del Paciente · Área de Gestión Sanitaria Sur de Córdoba; Carlos J. Galán Doval y Rafael J. Romero de Castilla Gil). El contacto está preparado como comentario dentro del bloque.

## 2. Arquitectura
- `index.html` — todo el contenido (estático): portada, grupos de apps, mapa SVG (dos versiones: `.mapa-h` horizontal desde 760 px y `.mapa-v` vertical en móvil), «Traer de…», Guía, pie. Script inline que fija `data-tema` antes de pintar.
- `styles.css` — tokens copiados de Auditorías + «Componentes propios del portal». Las clases `.m-*` colorean el SVG con los tokens (así cambia con el tema).
- `app.js` — solo botón de tema y registro del service worker.
- `sw.js` — network-first, `CACHE_NAME = "portal-vN"`.
- `iconos/` — iconos de cada app (copias a 96 px de sus `icon-192.png`; ACSA y Guía dibujados en SVG).

## 3. Reglas por compartir origen con TODAS las apps (importante)
- `localStorage`: solo claves con prefijo `portal-` (hoy, `portal-tema`). Nunca leer ni escribir claves de las apps.
- El service worker se registra con `scope: "./index.html"` y el manifest tiene `scope: "./index.html"`. **No ampliar el ámbito a la raíz**: controlaría las páginas de las apps (falso aviso «Nueva versión disponible» en su primera visita) y podría capturar sus enlaces.
- En `activate` solo se borran cachés que empiecen por `portal-`.

## 4. Al añadir o cambiar una app
1. Copiar su icono: `python3` + PIL, 96 × 96, a `iconos/<app>.png`, y añadirlo a `ASSETS` en `sw.js`.
2. Tarjeta en su grupo de `index.html` (icono, nombre, frase de beneficio, «Abrir … ›»).
3. Si intercambia datos: caja del mapa (las dos versiones del SVG), pie de figura y lista «Traer de…».
4. Actualizar `ECOSISTEMA.md`.

## 5. Pruebas y versiones
- Servir en local: `cd "/Users/Trabajo/Desktop/Calidad&Seguridad/Ecosistema Calidad/Portal/Aplicación" && python3 -m http.server 8790` y abrir http://localhost:8790/index.html.
- Revisar en escritorio y a 360 px (`document.documentElement.scrollWidth === 360`), en claro y en oscuro, y que `Object.keys(localStorage)` solo tenga claves `portal-`.
- Versión `APP_VERSION` en `app.js` (AAAA.NN); al cambiar archivos, mismos `?v=` en index.html y subir `CACHE_NAME` en sw.js.
- Copias: `bash ~/.claude/skills/app-copia_seguridad/scripts/copia_seguridad.sh --root "/Users/Trabajo/Desktop/Calidad&Seguridad/Ecosistema Calidad/Portal" --name Portal --exclude .claude`.

## 6. Publicación
**Sin publicar** (v2026.01 en local, 2026-10-25; v2026.02, con Legibilidad en «Herramientas de apoyo», también en local). Para publicar, solo cuando el autor lo pida: crear el repositorio público `cjgaland/cjgaland.github.io`, `git remote add origin …`, push a `main` y activar GitHub Pages desde `main` (raíz). Commits en español terminados en `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
