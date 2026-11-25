/* Anuncio de la versión nueva.
   activa: enciende la ventana emergente del inicio, la banda del inicio y el enlace del pie.
   v31: enciende lo de Domingo 3.1 (sección en /novedades/, títulos 3.1 y herramientas nuevas en Funciones).
   Cambia v31 a true cuando el release v3.1.0 esté publicado y marcado como Latest en domingo-descargas.
   Para revisar antes: #prueba-novedades (todo lo de 3.0) o #prueba-31 (también lo de 3.1). */
window.DOMINGO_NOVEDADES = { activa: true, v31: true };
(function () {
  var N = window.DOMINGO_NOVEDADES, h = '';
  try { h = location.hash; } catch (e) {}
  if (h === '#prueba-novedades' || h === '#prueba-31') N.activa = true;
  if (h === '#prueba-31') N.v31 = true;
  if (N.activa) document.documentElement.classList.add('novedades-on');
  if (N.v31) document.documentElement.classList.add('v31-on');
})();
