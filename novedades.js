/* Anuncio de la actualización de noviembre.
   Cambia "activa" a true cuando el release nuevo esté publicado y marcado como Latest en domingo-descargas.
   Enciende la barra de novedades, la banda del inicio, el enlace del pie y los textos nuevos de Talleres y Lite.
   Para revisar cómo se ve antes de activarla: añade #prueba-novedades a la dirección. */
window.DOMINGO_NOVEDADES = { activa: true };
(function () {
  try { if (location.hash === '#prueba-novedades') window.DOMINGO_NOVEDADES.activa = true; } catch (e) {}
  if (window.DOMINGO_NOVEDADES.activa) document.documentElement.classList.add('novedades-on');
})();
