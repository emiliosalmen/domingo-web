/* Prueba gratis de Domingo.
   Cambia "activa" a true cuando el release con la prueba de 14 días esté publicado y marcado como Latest
   en domingo-descargas. Lo leen la página principal y /instalar.
   Para revisar cómo se ve antes de activarla: añade #prueba-gratis a la dirección. */
window.DOMINGO_PRUEBA = { activa: true, dias: 14 };
(function () {
  try { if (location.hash === '#prueba-gratis') window.DOMINGO_PRUEBA.activa = true; } catch (e) {}
  if (window.DOMINGO_PRUEBA.activa) document.documentElement.classList.add('prueba-on');
})();
