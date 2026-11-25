/* Domingo · movimiento del sitio
   Tipografía cinética, revelado al desplazar, paralaje, inclinación 3D y microinteracciones.
   No hace nada si la persona pidió reducir movimiento en su sistema. */
(function () {
  const raiz = document.documentElement;
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const barra = document.querySelector('.barra');
  if (barra && !barra.querySelector('.progreso')) { const p = document.createElement('div'); p.className = 'progreso'; barra.appendChild(p); }
  if (reducir) { raiz.classList.add('sin-mov'); return; }
  raiz.classList.add('mov');

  /* ---------- Tipografía cinética: cada palabra sube desde su renglón ---------- */
  let n = 0;
  function partir(nodo) {
    Array.from(nodo.childNodes).forEach(h => {
      if (h.nodeType === 3) {
        const frag = document.createDocumentFragment();
        h.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
          const k = document.createElement('span'); k.className = 'k';
          const i = document.createElement('span'); i.className = 'ki'; i.style.setProperty('--i', n++); i.textContent = t;
          k.appendChild(i); frag.appendChild(k);
        });
        h.replaceWith(frag);
      } else if (h.nodeType === 1 && h.tagName !== 'SVG' && !h.classList.contains('trazo')) {
        if (h.tagName === 'EM') {
          /* "domingo" se mueve como una sola palabra, con su trazo */
          const k = document.createElement('span'); k.className = 'k';
          const i = document.createElement('span'); i.className = 'ki'; i.style.setProperty('--i', n++);
          h.replaceWith(k); k.appendChild(i); i.appendChild(h);
        } else partir(h);
      }
    });
  }
  const titulos = $$('main h1, main h2').filter(h => !h.closest('.menu') && !h.closest('.ficha-estilo'));
  titulos.forEach(h => { n = 0; partir(h); h.classList.add('kin'); });

  /* trazo bajo "domingo" */
  const em = document.querySelector('.portada h1 em');
  if (em) em.insertAdjacentHTML('beforeend', '<svg class="trazo" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 13 C 45 5, 95 4, 140 9 S 190 15, 197 8"/></svg>');

  /* ---------- Revelado escalonado ---------- */
  const grupos = new Map();
  $$('.aparece').forEach(el => {
    const p = el.parentElement; const i = grupos.get(p) || 0; grupos.set(p, i + 1);
    el.style.setProperty('--d', Math.min(i * 90, 450) + 'ms');
  });
  $$('.hito').forEach((h, i) => h.style.setProperty('--d', (300 + i * 180) + 'ms'));
  $$('.menu li').forEach((li, i) => li.style.setProperty('--d', (i * 70) + 'ms'));
  const vigilar = $$('.aparece, .kin, .filete, .hitos, .hito, .menu, [data-cuenta]');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('visto');
    if (el.classList.contains('kin')) el.classList.add('k-on');
    if (el.hasAttribute('data-cuenta')) contar(el);
    io.unobserve(el);
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  vigilar.forEach(el => io.observe(el));

  /* ---------- Números que cuentan ---------- */
  function contar(el) {
    const fin = parseInt(String(el.textContent).replace(/[^\d]/g, ''), 10);
    if (!fin) return;
    const t0 = performance.now(), dur = Math.min(1400, 500 + fin * 2);
    const miles = /,/.test(el.textContent);
    (function paso(t) {
      const k = Math.min(1, (t - t0) / dur), v = Math.round(fin * (1 - Math.pow(1 - k, 3)));
      el.textContent = miles ? v.toLocaleString('en-US') : String(v);
      if (k < 1) requestAnimationFrame(paso);
    })(t0);
  }

  /* ---------- Paralaje y avance de lectura ---------- */
  const prog = document.querySelector('.progreso');
  const escena = document.querySelector('.escena');
  const par = $$('[data-par]').map(el => ({ el, f: parseFloat(el.dataset.par) || .1 }));
  const filas = $$('.cinta .fila');
  let pend = false;
  function cuadro() {
    pend = false;
    const y = scrollY, h = innerHeight, max = document.documentElement.scrollHeight - h;
    if (prog) prog.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (escena) {
      const r = escena.getBoundingClientRect();
      if (r.bottom > 0 && r.top < h) {
        const c = (r.top + r.height / 2 - h / 2);
        escena.style.setProperty('--p1', (c * -0.10).toFixed(1) + 'px');
        escena.style.setProperty('--p2', (c * 0.03).toFixed(1) + 'px');
        escena.style.setProperty('--p3', (c * 0.16).toFixed(1) + 'px');
      }
    }
    par.forEach(({ el, f }) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > h + 200) return;
      const c = (r.top + r.height / 2 - h / 2);
      el.style.translate = '0 ' + (c * -f).toFixed(1) + 'px';
    });
    filas.forEach((f, i) => {
      const r = f.getBoundingClientRect();
      if (r.bottom < 0 || r.top > h) return;
      const d = (h - r.top) * 0.35;
      f.style.transform = 'translate3d(' + (i % 2 ? d - 600 : -d) + 'px,0,0)';
    });
  }
  const pedir = () => { if (!pend) { pend = true; requestAnimationFrame(cuadro); } };
  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir);
  cuadro();

  if (!fino) return; /* lo que sigue necesita ratón */

  /* ---------- Escena del inicio en 3D, sigue al cursor ---------- */
  const portada = document.querySelector('.portada');
  const plano = escena && escena.querySelector('.plano');
  if (portada && plano) {
    portada.addEventListener('pointermove', e => {
      const r = escena.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / innerWidth, yy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
      plano.style.setProperty('--ry', (x * 14).toFixed(2) + 'deg');
      plano.style.setProperty('--rx', (-yy * 10).toFixed(2) + 'deg');
    });
    portada.addEventListener('pointerleave', () => { plano.style.setProperty('--ry', '0deg'); plano.style.setProperty('--rx', '0deg'); });
  }

  /* ---------- Inclinación 3D con brillo ---------- */
  $$('[data-inclina]').forEach(el => {
    const max = parseFloat(el.dataset.inclina) || 7;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.classList.add('sobre');
      el.style.setProperty('--ty', ((x - .5) * max * 2).toFixed(2) + 'deg');
      el.style.setProperty('--tx', ((.5 - y) * max * 2).toFixed(2) + 'deg');
      el.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
      el.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
    });
    el.addEventListener('pointerleave', () => { el.classList.remove('sobre'); el.style.setProperty('--tx', '0deg'); el.style.setProperty('--ty', '0deg'); });
  });

  /* ---------- Botones: onda al pulsar e imán ---------- */
  document.addEventListener('pointerdown', e => {
    const b = e.target.closest('.boton'); if (!b) return;
    const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2;
    const o = document.createElement('span'); o.className = 'onda';
    o.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
    b.appendChild(o); setTimeout(() => o.remove(), 650);
  });
  $$('.portada .acciones .boton, .cabeza .acciones .boton, .lite .acciones .boton').forEach(b => {
    b.classList.add('iman');
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + 'px)';
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });

  /* ---------- Misi salta si lo tocas ---------- */
  const misi = document.querySelector('.escena .misi');
  if (misi) misi.addEventListener('click', () => { misi.classList.remove('salta'); void misi.offsetWidth; misi.classList.add('salta'); });
  if (misi) misi.addEventListener('animationend', e => { if (e.animationName === 'salta') misi.classList.remove('salta'); });
})();
