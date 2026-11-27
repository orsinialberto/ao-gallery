/* Splash d'ingresso: foto impilate al centro → una alla volta in ordine casuale → esplosione ai loro posti
   Solo le foto visibili nella prima schermata volano al loro posto; le altre escono dallo schermo a raggiera e restano ferme sotto.
   Tempi: attesa min. 300 ms + load, esplosione 1 s dopo l'ultima comparsa, durata 1,6–2,4 s. */
(() => {
  const root = document.documentElement;
  if (!root.classList.contains('splash')) return;
  const figs = [...document.querySelectorAll('#s02-griglia .ph')], N = figs.length;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);
  const vw = innerWidth, vh = innerHeight;
  // le foto visibili nella prima schermata sono le "protagoniste": volano al loro posto; le altre svaniscono dalla pila
  const rects = figs.map((f) => f.getBoundingClientRect());
  const hero = rects.map((r) => (Math.min(r.bottom, vh) - Math.max(r.top, 0)) >= 0.1 * r.height);
  const H = hero.filter(Boolean).length, K = Math.max(9, H + 3); // K = ultima foto che compare prima dell'esplosione
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [a[i], a[k]] = [a[k], a[i]]; } return a; };
  // ordine di comparsa: le protagoniste per ultime (in cima alla pila), così all'esplosione sono sopra tutte
  const zHero = shuffle(Array.from({ length: H }, (_, i) => K - H + 1 + i));
  const zRest = shuffle([...Array.from({ length: K - H }, (_, i) => i + 1), ...Array.from({ length: N - K }, (_, i) => K + 1 + i)]);
  // le foto della pila che non sono protagoniste escono dallo schermo in direzioni diverse, a raggiera dal centro
  const outCount = K - H, ang = shuffle(Array.from({ length: outCount }, (_, i) => ((i + 0.5) / outCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5));
  let hi = 0, ri = 0, oi = 0;
  figs.forEach((f, i) => { // le coordinate si misurano prima che le variabili spostino le foto
    const r = rects[i], z = hero[i] ? zHero[hi++] : zRest[ri++], out = !hero[i] && z <= K;
    if (hero[i] || out) { // le altre restano al loro posto (nascoste): così le foto lazy sotto la piega non si scaricano all'avvio
      f.style.setProperty('--tx', `${vw / 2 - (r.left + r.width / 2)}px`);
      f.style.setProperty('--ty', `${vh / 2 - (r.top + r.height / 2)}px`);
    }
    f.style.setProperty('--z', z);
    f.style.setProperty('--dl', Math.floor(Math.random() * 12)); // ritardo casuale 0–0,12 s
    f.style.setProperty('--du', `${(0.8 * Math.random() + 1.6).toFixed(2)}s`); // durata 1,6–2,4 s
    f.classList.toggle('hero', hero[i]);
    f.classList.toggle('out', out);
    if (out) { // distanza sufficiente a uscire del tutto dallo schermo, qualunque sia la direzione
      const d = 0.5 * Math.hypot(vw, vh) + 0.5 * Math.hypot(r.width, r.height) + 40, a = ang[oi++];
      f.style.setProperty('--ox', `${(Math.cos(a) * d).toFixed(1)}px`);
      f.style.setProperty('--oy', `${(Math.sin(a) * d).toFixed(1)}px`);
    }
  });
  let ready = document.readyState === 'complete', min = false, started = false;
  const go = () => {
    if (started || !ready || !min) return;
    started = true; root.classList.add('loaded');
    setTimeout(() => { root.classList.add('finished'); setTimeout(() => root.classList.add('settled'), 2800); }, 1000);
  };
  setTimeout(() => { min = true; go(); }, 300);
  if (!ready) addEventListener('load', () => { ready = true; go(); });
  else go();
  setTimeout(() => { if (!started) { started = true; root.classList.add('loaded', 'finished', 'settled'); } }, 5000);
})();

/* Stampa — script.js · visore "focus" (comportamento della pagina focus di gregorcollienne.com):
   foto grande al centro, colonna di miniature a sinistra; la rotella scorre colonna e foto insieme.
   Scorrimento ammorbidito, miniatura più vicina al centro = foto attiva, onda quadratica sulle miniature vicine,
   ingresso a cascata. Mobile: fila di miniature in basso, swipe orizzontale. Esc o X per chiudere. */
(() => {
  const figs = [...document.querySelectorAll('#s02-griglia .ph')];
  if (!figs.length) return;
  const mq = matchMedia('(max-width:768px)'), rm = matchMedia('(prefers-reduced-motion:reduce)');
  const N = figs.length;
  let lb, thumbs, focus, cap, items = [], slides = [], pos = [], mid = [], built = false;
  let cur = 0, target = 0, min = 0, max = 0, active = -1, raf = 0, last = 0, fast = false, opener = null, introT = 0;

  const build = () => {
    built = true;
    lb = document.createElement('div');
    lb.className = 'lb'; lb.tabIndex = -1; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Fotografie');
    lb.innerHTML = '<button class="lb-x" type="button" aria-label="Chiudi"><i></i><i></i></button><div class="lb-focus"></div><p class="lb-cap"></p><div class="lb-thumbs"></div>';
    focus = lb.querySelector('.lb-focus'); thumbs = lb.querySelector('.lb-thumbs'); cap = lb.querySelector('.lb-cap');
    figs.forEach((f, n) => {
      const src = f.querySelector('picture'), img = src.querySelector('img');
      const s = document.createElement('div'); s.className = 'lb-slide'; focus.append(s); slides.push(s);
      const t = document.createElement('button'); t.type = 'button'; t.className = 'lb-thumb'; t.setAttribute('aria-label', `Foto ${n + 1} di ${N}, ${f.dataset.title}: ${img.alt}`);
      t.style.aspectRatio = `${img.getAttribute('width')} / ${img.getAttribute('height')}`;
      const m = document.createElement('span'); m.className = 'lb-m';
      const p = src.cloneNode(true);
      p.querySelectorAll('[sizes]').forEach((e) => e.setAttribute('sizes', '104px'));
      const i = p.querySelector('img'); i.removeAttribute('loading'); i.removeAttribute('fetchpriority'); i.draggable = false;
      m.append(p); t.append(m); thumbs.append(t); items.push(t); pos.push(0);
      t.addEventListener('click', () => goTo(n));
    });
    document.body.append(lb);
    lb.querySelector('.lb-x').addEventListener('click', close);
    lb.addEventListener('wheel', onWheel, { passive: false });
    lb.addEventListener('touchstart', onTouchStart, { passive: true });
    lb.addEventListener('touchmove', onTouchMove, { passive: false });
    lb.addEventListener('touchend', onTouchEnd, { passive: true });
    addEventListener('resize', () => { if (lb.classList.contains('open')) { measure(); placeCap(); } });
    addEventListener('keydown', onKey);
  };

  const fill = (n) => { // la foto grande si carica solo quando serve (attiva e vicine)
    const k = (n + N) % N, s = slides[k];
    if (s.firstChild) return;
    const pic = figs[k].querySelector('picture').cloneNode(true);
    pic.querySelectorAll('[sizes]').forEach((e) => e.setAttribute('sizes', '80vw'));
    const img = pic.querySelector('img'); img.removeAttribute('loading'); img.removeAttribute('fetchpriority'); img.draggable = false;
    s.append(pic);
  };
  const setActive = (n) => {
    if (active >= 0) { slides[active].classList.remove('on'); items[active].classList.remove('is-active'); }
    active = n; slides[n].classList.add('on'); items[n].classList.add('is-active');
    cap.textContent = `${String(n + 1).padStart(2, '0')} — ${figs[n].dataset.title}`;
    [n - 1, n, n + 1].forEach(fill);
    placeCap();
  };
  // la foto (contain) è centrata nella sua area: la didascalia sale fino al suo bordo inferiore (mobile, iPad e desktop)
  const placeCap = () => {
    if (active < 0) return;
    const img = figs[active].querySelector('img'), fw = focus.clientWidth, fh = focus.clientHeight;
    const h = Math.min(fh, fw * img.getAttribute('height') / img.getAttribute('width'));
    cap.style.transform = '';
    const photoBottom = focus.getBoundingClientRect().top + (fh + h) / 2;
    cap.style.transform = `translateY(${Math.min(0, photoBottom - cap.getBoundingClientRect().top)}px)`;
  };

  // misure: centro di ogni miniatura lungo l'asse di scorrimento (colonna su desktop, fila su mobile)
  const measure = () => {
    const v = !mq.matches, first = items[0], lastI = items[N - 1];
    thumbs.style.setProperty('--first', (v ? first.offsetHeight : first.offsetWidth) + 'px');
    thumbs.style.setProperty('--last', (v ? lastI.offsetHeight : lastI.offsetWidth) + 'px');
    mid = items.map((e) => (v ? e.offsetTop + e.offsetHeight / 2 : e.offsetLeft + e.offsetWidth / 2));
    const half = (v ? innerHeight : innerWidth) / 2;
    min = mid[0] - half; max = mid[N - 1] - half;
    target = Math.min(max, Math.max(min, target)); cur = Math.min(max, Math.max(min, cur));
  };
  const centerOf = (n) => mid[n] - (mq.matches ? innerWidth : innerHeight) / 2;
  const goTo = (n) => { target = Math.min(max, Math.max(min, centerOf(Math.min(N - 1, Math.max(0, n))))); fast = true; };

  const frame = (t) => {
    const dt = Math.min(64, t - last || 16.7); last = t;
    const r = rm.matches, k = r ? 1 : (fast || touching) ? 0.12 : 0.03, f = dt / 16.667;
    cur += (target - cur) * (1 - Math.pow(1 - k, f));
    if (Math.abs(target - cur) < 0.05) { cur = target; fast = false; }
    const v = !mq.matches, half = (v ? innerHeight : innerWidth) / 2, range = v ? 220 : 170, amp = v ? 52 : 20; // onda: raggio e spostamento max (px), in scala con le miniature
    const lk = r ? 1 : 1 - Math.pow(1 - 0.08, f);
    thumbs.style.transform = v ? `translate3d(0,${-cur}px,0)` : `translate3d(${-cur}px,0,0)`;
    let best = Infinity, bi = 0;
    for (let i = 0; i < N; i++) {
      const d = Math.abs(mid[i] - cur - half), u = d < range ? (1 - d / range) ** 2 * amp : 0;
      pos[i] += (u - pos[i]) * lk;
      items[i].style.transform = v ? `translateX(${pos[i].toFixed(2)}px)` : `translateY(${(-pos[i]).toFixed(2)}px)`;
      if (d < best) { best = d; bi = i; }
    }
    if (bi !== active) setActive(bi);
    raf = requestAnimationFrame(frame);
  };

  const open = (n, from) => {
    if (!built) build();
    opener = from; clearTimeout(introT);
    lb.classList.remove('in'); lb.classList.add('open'); document.documentElement.style.overflow = 'hidden';
    pos.fill(0); active = -1; slides.forEach((s) => s.classList.remove('on')); items.forEach((e) => e.classList.remove('is-active'));
    measure(); cur = target = centerOf(n); fast = false;
    items.forEach((e, i) => e.style.setProperty('--sd', Math.abs(i - n)));
    setActive(n);
    last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
    requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('in'))); // ingresso a cascata
    lb.focus({ preventScroll: true }); // niente anello sulla X all'apertura
  };
  const close = () => {
    lb.classList.remove('open'); document.documentElement.style.overflow = '';
    introT = setTimeout(() => { cancelAnimationFrame(raf); lb.classList.remove('in'); }, 500);
    if (opener) opener.focus({ preventScroll: true });
  };

  const clamp = (v) => Math.min(max, Math.max(min, v));
  function onWheel(e) {
    e.preventDefault();
    let d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (e.deltaMode === 1) d *= 16;
    target = clamp(target + d); fast = false;
  }
  let tx = 0, ty = 0, vel = 0, mom = 0, touching = false;
  const GAIN = 2.2; // scorrimento da touch: la fila si muove più del dito (più veloce)
  function onTouchStart(e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; vel = 0; touching = true; cancelAnimationFrame(mom); }
  function onTouchMove(e) {
    const x = e.touches[0].clientX, y = e.touches[0].clientY, d = mq.matches ? x - tx : y - ty;
    e.preventDefault(); target = clamp(target - d * GAIN); vel = -d * GAIN; fast = false; tx = x; ty = y;
  }
  function onTouchEnd() {
    if (Math.abs(vel) < 1) { touching = false; return; }
    const step = () => { if (Math.abs(vel) < 0.5) { touching = false; return; } target = clamp(target + vel); vel *= 0.96; mom = requestAnimationFrame(step); };
    mom = requestAnimationFrame(step);
  }
  function onKey(e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
    else if (e.key === 'Tab') { // il focus resta dentro la finestra
      const f = [...lb.querySelectorAll('button')], a = document.activeElement;
      if (e.shiftKey && a === f[0]) { e.preventDefault(); f.at(-1).focus(); } else if (!e.shiftKey && a === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  }

  figs.forEach((f, n) => f.querySelector('a').addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return; // nuova scheda: comportamento normale
    e.preventDefault(); open(n, e.currentTarget);
  }));
})();

/* Torna in alto: la freccia compare oltre poco più di metà della prima schermata. */
(() => {
  const button = document.getElementById('to-top');
  if (!button) return;
  const calm = matchMedia('(prefers-reduced-motion:reduce)');
  const sync = () => button.classList.toggle('show', scrollY > innerHeight * 0.6);
  button.hidden = false;
  addEventListener('scroll', sync, { passive: true });
  addEventListener('resize', sync);
  button.addEventListener('click', (e) => {
    scrollTo({ top: 0, behavior: calm.matches ? 'instant' : 'smooth' });
    // da tastiera il focus torna in cima, invece di perdersi quando la freccia sparisce
    if (e.detail === 0) document.querySelector('.site-name').focus({ preventScroll: true });
  });
  sync();
})();

/* Reveal allo scroll: le foto sotto lo schermo compaiono, una sola volta, quando ci si arriva e l'immagine è pronta. */
(() => {
  const figs = [...document.querySelectorAll('#s02-griglia .ph')];
  if (!figs.length || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const arm = () => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const f = e.target, img = f.querySelector('img');
      io.unobserve(f);
      img.loading = 'eager';
      // se l'immagine fallisce o resta appesa (oltre 2,5 s), il riquadro si mostra comunque
      Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 2500))])
        .then(() => f.classList.replace('reveal-wait', 'reveal-in'));
    }), { rootMargin: '0px 0px -12% 0px' });
    figs.filter((f) => f.getBoundingClientRect().top >= innerHeight).forEach((f) => { f.classList.add('reveal-wait'); io.observe(f); });
  };
  // con lo splash si aspetta la fine: prima, nascondere le foto cancellerebbe quelle che volano fuori schermo
  const root = document.documentElement, busy = () => root.classList.contains('splash') && !root.classList.contains('settled');
  if (!busy()) return arm();
  const mo = new MutationObserver(() => { if (!busy()) { mo.disconnect(); arm(); } });
  mo.observe(root, { attributes: true, attributeFilter: ['class'] });
})();
