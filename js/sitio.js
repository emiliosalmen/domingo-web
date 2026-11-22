/* ============================================================
   CONFIGURACIÓN · lo único que necesitas editar
   ============================================================ */
const CONFIG = {
  // Enlaces de compra de Polar. El pago se abre sobre el sitio, con tema claro.
  // Preventa (ya incluye el código MANGO) hasta el 22 de noviembre a las 23:59; venta desde el 23.
  checkoutPreventa: "https://buy.polar.sh/polar_cl_9hj7qkpe0u4ZlLj2QggbKz6zzjJ4KeN9v4ZDq0RdbRq",
  checkoutVenta:    "https://buy.polar.sh/polar_cl_whcDHK2vUrVFwJDrdAdMXPNLgvHJ8XazWONUk0xSvaQ",
  // Enlaces directos a los instaladores. Si están vacíos, los botones quedan desactivados.
  descargaMac: "https://github.com/emiliosalmen/domingo-descargas/releases/latest/download/Domingo-mac.dmg",
  descargaWin: "https://github.com/emiliosalmen/domingo-descargas/releases/latest/download/Domingo-windows.exe",
  // Fechas en hora de Monterrey (UTC-6)
  preventa:    "2026-11-15T00:00:00-06:00",
  lanzamiento: "2026-11-22T00:00:00-06:00",
  finPreventa: "2026-11-23T00:00:00-06:00",
  descargas:   "2026-11-18T00:00:00-06:00",
  codigo: "MANGO",
  precio: 499,
  precioPreventa: 399
};

(function () {
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const T = s => new Date(s).getTime();
  const R = document.documentElement.dataset.raiz || "";
  const pon = (sel, fn) => { const el = $(sel); if (el) fn(el); };

  /* Fase de venta. Para revisar: #prueba-antes, #prueba-preventa, #prueba-ultimo-dia o #prueba-venta */
  function fase() {
    const h = location.hash;
    if (h === "#prueba-antes") return "antes";
    if (h === "#prueba-preventa") return "preventa";
    if (h === "#prueba-ultimo-dia" || h === "#prueba-venta") return "venta";
    const n = Date.now();
    if (n < T(CONFIG.preventa)) return "antes";
    if (n < T(CONFIG.lanzamiento)) return "preventa";
    return "venta";
  }
  function preventaVigente() {
    const h = location.hash;
    if (h === "#prueba-preventa" || h === "#prueba-ultimo-dia") return true;
    if (h === "#prueba-venta") return false;
    const n = Date.now();
    return n >= T(CONFIG.preventa) && n < T(CONFIG.finPreventa);
  }

  function pintar() {
    const f = fase(), pv = preventaVigente();
    let destino = "", texto = "Comprar";
    let etq, tit, nota;
    if (f === "antes") {
      etq = "Muy pronto"; tit = "La preventa abre el domingo 15 de noviembre";
      nota = "Las primeras 10 personas pagan $" + CONFIG.precioPreventa + " MXN con el código <b>" + CONFIG.codigo + "</b>.";
      texto = "Comprar el 15 de noviembre";
    } else if (f === "preventa") {
      etq = "Preventa abierta"; tit = "Domingo llega en domingo, el 22 de noviembre";
      nota = "Ahora $" + CONFIG.precioPreventa + " MXN para las primeras 10 personas, con el código <b>" + CONFIG.codigo + "</b> ya incluido.";
      texto = "Comprar en preventa";
    } else {
      etq = "Ya disponible"; tit = "Domingo ya está aquí";
      nota = pv ? "Hoy es el último día de preventa: $" + CONFIG.precioPreventa + " MXN para las primeras 10 personas, hasta las 23:59."
                : "$" + CONFIG.precio + " MXN, pago único. Licencia para 2 equipos.";
      texto = pv ? "Comprar en preventa" : "Comprar Domingo";
    }
    pon("#cuenta-estado", e => e.textContent = etq);
    pon("#cuenta-titulo", e => e.textContent = tit);
    pon("#cuenta-nota", e => e.innerHTML = nota);
    pon("#reloj", e => e.hidden = f === "venta");

    if (f !== "antes") destino = pv ? CONFIG.checkoutPreventa : CONFIG.checkoutVenta;
    pon("#precio-antes", e => e.hidden = !pv);
    pon("#precio-num", e => e.textContent = pv ? CONFIG.precioPreventa : CONFIG.precio);
    pon("#precio-texto", e => e.textContent = pv
      ? "Precio de preventa con el código " + CONFIG.codigo + ", ya incluido, solo para las primeras 10 personas."
      : "Pago único, licencia de por vida.");
    const terminada = f !== "antes" && !pv;
    pon("#preventa-titulo", e => e.textContent = terminada ? "Terminó el 22 de noviembre" : "Del 15 al 22 de noviembre");
    pon("#preventa-texto", e => e.innerHTML = terminada
      ? "Gracias a quienes compraron en preventa. Ahora Domingo cuesta <b>$" + CONFIG.precio + " MXN</b>, pago único."
      : "Las primeras 10 personas que compren durante la preventa pagan <b>$" + CONFIG.precioPreventa + " MXN</b>. El código ya va incluido en el botón de compra.");
    pon("#preventa-codigo", e => e.hidden = terminada);
    pon("#faq-preventa", e => e.textContent = "Del domingo 15 al domingo 22 de noviembre a las 23:59, las primeras 10 personas que compraron obtuvieron Domingo por $" + CONFIG.precioPreventa + " MXN con el código " + CONFIG.codigo + ". Después el precio es $" + CONFIG.precio + " MXN.");

    /* Botones de compra: Polar abre el pago sobre la página. Si su script no carga, son enlaces normales. */
    $$("[data-cta]").forEach(a => {
      if (destino) {
        a.href = destino;
        a.setAttribute("data-polar-checkout", "");
        a.setAttribute("data-polar-checkout-theme", "light");
        a.removeAttribute("aria-disabled");
      } else {
        a.href = R + "precio/";
        a.removeAttribute("data-polar-checkout");
        a.setAttribute("aria-disabled", "true");
      }
      if (!("fijo" in a.dataset)) a.textContent = texto;
    });

    /* Domingo Lite abre con la preventa */
    const liteAbierta = f !== "antes";
    $$("[data-lite]").forEach(a => {
      if (!a.dataset.texto) a.dataset.texto = a.textContent;
      if (liteAbierta) { a.href = R + "probar/"; a.removeAttribute("aria-disabled"); a.textContent = a.dataset.texto; }
      else { a.href = R + "precio/#probar"; a.setAttribute("aria-disabled", "true"); a.textContent = "Disponible el 15 de noviembre"; }
    });

    /* Descargas */
    const abiertas = Date.now() >= T(CONFIG.descargas) || /^#prueba-(venta|ultimo-dia)$/.test(location.hash);
    [["#descarga-mac", CONFIG.descargaMac], ["#descarga-win", CONFIG.descargaWin]].forEach(([sel, url]) => pon(sel, a => {
      if (abiertas && url) { a.href = url; a.removeAttribute("aria-disabled"); }
      else { a.href = "#descargas"; a.setAttribute("aria-disabled", "true"); }
    }));
    pon("#descarga-intro", e => e.textContent = abiertas
      ? (window.DOMINGO_PRUEBA && DOMINGO_PRUEBA.activa
          ? "Descárgala gratis y úsala 14 días con todas las herramientas, sin cuenta ni tarjeta. Al terminar, tus manuscritos siguen ahí para leer y exportar; para seguir escribiendo, compra tu licencia."
          : "Elige tu sistema. La descarga es libre; tu clave de licencia la desbloquea.")
      : "Las descargas se abren el domingo 22 de noviembre.");
    return f;
  }

  /* Cuenta regresiva (solo si la página la tiene) */
  const dos = n => String(n).padStart(2, "0");
  function tic() {
    const f = pintar();
    if (!$("#reloj")) return;
    const meta = f === "antes" ? T(CONFIG.preventa) : T(CONFIG.lanzamiento);
    let r = Math.max(0, meta - Date.now());
    if (location.hash.startsWith("#prueba")) r = 3 * 864e5 + 5 * 36e5 + 42 * 6e4 + 17e3;
    const d = Math.floor(r / 864e5), h = Math.floor(r % 864e5 / 36e5), m = Math.floor(r % 36e5 / 6e4), s = Math.floor(r % 6e4 / 1e3);
    $("#r-d").textContent = dos(d); $("#r-h").textContent = dos(h); $("#r-m").textContent = dos(m); $("#r-s").textContent = dos(s);
  }
  tic(); setInterval(tic, 1000);
  window.addEventListener("hashchange", tic);

  /* Copiar código */
  const aviso = $("#aviso");
  function avisar(t) { aviso.textContent = t; aviso.classList.add("ver"); clearTimeout(avisar.t); avisar.t = setTimeout(() => aviso.classList.remove("ver"), 2200); }
  pon("#codigo", b => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(CONFIG.codigo); avisar("Código " + CONFIG.codigo + " copiado"); }
    catch (e) { avisar("Tu código es " + CONFIG.codigo); }
  }));

  /* Subnavegación que sigue la lectura */
  const sub = $$(".sub a");
  if (sub.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) sub.forEach(a => a.classList.toggle("activo", a.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-40% 0px -55% 0px" });
    sub.forEach(a => { const s = document.querySelector(a.getAttribute("href")); if (s) io.observe(s); });
  }

  pon("#anio", e => e.textContent = new Date().getFullYear());

  /* Aparición suave */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); } }), { threshold: .12 });
    $$(".aparece").forEach(el => io.observe(el));
  } else $$(".aparece").forEach(el => el.classList.add("visto"));
})();
