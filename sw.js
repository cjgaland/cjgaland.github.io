// ============================================================
//  sw.js — Service Worker · Portal (raíz de cjgaland.github.io)
//  El portal comparte origen con TODAS las apps. Para no interferir con ellas:
//   · se registra con scope "./index.html": solo controla la página del portal, nunca /amfe/, /auditorias/…
//     (si controlara una app, esta vería un «controller» ajeno y mostraría un falso «Nueva versión disponible»);
//   · en «activate» solo borra cachés que empiecen por "portal-" (las de las apps no se tocan);
//   · solo responde a archivos del propio portal.
//  Estrategia network-first con copia en caché para abrirlo sin conexión.
//  Al cambiar cualquier archivo, incrementa CACHE_NAME.
// ============================================================

const CACHE_NAME = "portal-v3";

const ASSETS = [
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png",
  "./favicon-32.png",
  "./favicon-16.png",
  "./icon-512.svg",
  "./iconos/tamano-muestral.png",
  "./iconos/indicadores.png",
  "./iconos/auditorias.png",
  "./iconos/amfe.png",
  "./iconos/flujograma.png",
  "./iconos/dafo.png",
  "./iconos/mapa-riesgos.png",
  "./iconos/rondas-seguridad.png",
  "./iconos/anonimizador.png",
  "./iconos/normalizador.png",
  "./iconos/legibilidad.png",
  "./iconos/acsa.svg",
  "./iconos/guia.svg"
];
const PROPIOS = new Set(ASSETS.map(a => new URL(a, self.location).pathname).concat([new URL("./", self.location).pathname]));

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith("portal-") && k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !PROPIOS.has(url.pathname)) return;   // lo demás, sin tocar
  event.respondWith(
    fetch(req)
      .then(response => {
        if (response && response.status === 200 && response.type === "basic") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return response;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
