// ============================================================
//  app.js — Portal del ecosistema de Calidad y Seguridad del Paciente
//  Página estática: aquí solo el cambio de tema y el service worker.
//  OJO: el portal vive en la raíz de cjgaland.github.io y comparte origen (y localStorage) con TODAS las apps.
//  Solo puede leer y escribir claves que empiecen por "portal-" (hoy, únicamente "portal-tema").
// ============================================================
(function () {
  "use strict";

  const APP_VERSION = "2026.04";
  const CLAVE_TEMA = "portal-tema";

  // ---------- Tema claro / oscuro ----------
  const raiz = document.documentElement;
  const btnTema = document.getElementById("btn-tema");
  const rotular = () => {
    const oscuro = raiz.getAttribute("data-tema") === "oscuro";
    btnTema.setAttribute("aria-label", oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    btnTema.setAttribute("aria-pressed", String(oscuro));
  };
  btnTema.addEventListener("click", () => {
    const t = raiz.getAttribute("data-tema") === "oscuro" ? "claro" : "oscuro";
    raiz.setAttribute("data-tema", t);
    try { localStorage.setItem(CLAVE_TEMA, t); } catch (e) { /* sin almacenamiento: solo dura esta visita */ }
    rotular();
  });
  rotular();

  // ---------- Service worker ----------
  // Scope "./index.html": controla solo la página del portal, nunca las apps (ver sw.js).
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js", { scope: "./index.html" }).catch(() => {});
  }

  window.PORTAL = { version: APP_VERSION };
})();
