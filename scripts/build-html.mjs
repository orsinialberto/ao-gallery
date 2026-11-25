// Genera site/index.html e le regole di posizionamento del collage (blocco GRID in site/style.css) da images/manifest.json.
// Uso: node scripts/build-html.mjs (dopo build-images.mjs)
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(root + 'images/manifest.json', 'utf8'));
const SITE = 'https://gallery.albertorsini.it'; // dominio di pubblicazione (sitemap, canonical, Open Graph)

// ordine del board · alt
const P = [
  ['DSC01280', 'Barche ormeggiate al tramonto, con il sole sopra le montagne'],
  ['DSC00122', 'Lampadina a filamento nel buio'],
  ['DSC00204', 'Fili d’erba con gocce di pioggia'],
  ['DSC00374', 'Rifugio in legno sul lago alpino'],
  ['DSC00497', 'Scoiattolo su un tronco tagliato'],
  ['DSC00581', 'Rifugio di montagna con cappella, valle e ghiacciaio'],
  ['DSC00757', 'Risaie a terrazze gialle con una persona'],
  ['DSC00831', 'Baia con rocce calcaree e una barchetta con un uomo dal cappello conico'],
  ['DSC01009', 'Mano con unghie decorate su un’impugnatura'],
  ['DSC01131', 'Prua di barca con bandiera rossa e riflessi dorati'],
  ['DSC01134', 'Pila di noci di cocco'],
  ['DSC01139', 'Ninfee in bianco e nero con i fiori rosa a colori'],
  ['DSC01167', 'Veduta dall’alto di un laghetto con passerelle di legno'],
  ['DSC01176', 'Cima rocciosa con una pagoda e una scalinata'],
  ['DSC01186', 'Fiume tra montagne verdi visto dall’alto'],
  ['DSC01204', 'Fiori viola davanti a un mulino bianco'],
  ['DSC01251', 'Capra che attraversa un viale con un motorino e un tempietto'],
  ['DSC01262', 'Barcaiolo con cappello conico, di spalle, sulle barche'],
  ['DSC01371', 'Testa di drago in mosaico di ceramica'],
  ['DSC01590', 'Due lanterne gialle accese al buio'],
  ['DSC01971', 'Canale con palme e un cappello conico in primo piano'],
  ['IMG_5561', 'Tramonto sulla spiaggia, con nuvole rosate che si riflettono sulla sabbia bagnata'],
  ['IMG_7862', 'Gruppo di cipressi su una collina verde sotto un cielo azzurro'],
  ['IMG_8727', 'Costa con scogliere e spiaggia sabbiosa, con tre persone in cima al sentiero'],
  ['IMG_0308', 'Palazzo colorato di notte, all’angolo di una strada'],
  ['IMG_1060', 'Il tempio di Angkor Wat all’alba, con le palme riflesse nell’acqua'],
  ['IMG_8741', 'Surfista con la tavola in spalla su una spiaggia, vista dall’alto'],
  ['IMG_2899', 'Borgo in pietra con una scalinata, sotto un cielo nuvoloso'],
  ['IMG_0307', 'Insegna luminosa di un caffè di notte, con i motorini parcheggiati davanti'],
  ['IMG_2919', 'Alba sopra le colline avvolte dalla nebbia'],
];

// Layout desktop: gruppi di MASSIMO 2 foto, uno sotto l'altro, sfalsati (come il collage della preview).
// [indice foto (1-based), colonna iniziale, colonne occupate, sfasamento in righe dall'inizio del gruppo]
const GROUPS = [ // ritmo della preview: coppia, coppia, singola larga, singola…
  [[1, 5, 9, 0], [2, 19, 6, 4]],
  [[3, 2, 13, 0], [4, 18, 6, 3]],
  [[5, 9, 16, 0]],
  [[6, 3, 8, 0]],
  [[7, 14, 11, 0], [8, 2, 7, 3]],
  [[9, 3, 8, 0], [10, 17, 6, 4]],
  [[11, 6, 14, 0]],
  [[12, 3, 9, 0]],
  [[13, 12, 9, 0], [14, 2, 6, 4]],
  [[15, 8, 16, 0]],
  [[16, 3, 8, 0], [17, 16, 8, 3]],
  [[18, 7, 13, 0]],
  [[19, 3, 7, 0], [20, 18, 6, 3]],
  [[21, 9, 12, 0]],
  [[22, 5, 8, 0], [23, 16, 9, 3]],
  [[24, 3, 7, 0], [25, 13, 11, 4]],
  [[26, 6, 14, 0]],
  [[27, 11, 8, 0]],
  [[28, 14, 10, 0], [29, 3, 7, 3]],
  [[30, 8, 15, 0]],
];
const D_GAP = 3; // righe vuote tra un gruppo e il successivo (preview: 2–4)
// Mobile: una foto per volta, a zig-zag: [colonne occupate, sinistra|destra]
// larghezza mobile (colonne su 8): orizzontali grandi (7–8), verticali un po' più strette (6), con zig-zag leggero
const M_SPAN = P.map(([id], i) => { const m = manifest[id]; return m.height > m.width ? 6 : (i % 2 ? 8 : 7); });
const M_GAP = 2; // come la preview mobile
// px di riferimento: desktop 1440 (colonna 45,28, riga 28,8) · mobile 390 (colonna 33,375, riga 24); gap 11
const rowsFor = (aspect, span, colw, row) => Math.max(3, Math.round(((span * colw + (span - 1) * 11) / aspect + 11) / (row + 11)));

const place = {}; let dr = 1;
for (const g of GROUPS) {
  let h = 0;
  for (const [n, c, s, off] of g) {
    const m = manifest[P[n - 1][0]], r = rowsFor(m.width / m.height, s, 45.28, 28.8);
    place[n] = { d: [c, c + s, dr + off, dr + off + r] }; h = Math.max(h, off + r);
  }
  dr += h + D_GAP;
}
const dRows = dr - D_GAP - 1;
let mr = 1;
P.forEach(([id], i) => {
  const m = manifest[id], s = M_SPAN[i], r = rowsFor(m.width / m.height, s, 33.375, 24);
  const c = i % 2 ? 9 - s : 1;
  place[i + 1].m = [c, c + s, mr, mr + r]; mr += r + M_GAP;
});

let html = '', desk = '', mob = '';
P.forEach(([id, alt], i) => {
  const m = manifest[id], n = i + 1, { d: [c1, c2, r1, r2], m: [m1, m2, mr1, mr2] } = place[n];
  const set = (ext) => m.widths.map((w) => `images/photos/${id}-${w}.${ext} ${w}w`).join(', ');
  const big = `images/photos/${id}-${m.widths.at(-1)}.jpg`;
  const sizes = `(max-width:767px) ${Math.round(((m2 - m1) / 8) * 100)}vw, ${Math.round(((c2 - c1) / 24) * 100)}vw`;
  const eager = i < 4 || id === 'DSC00497';
  html += `  <figure class="ph p${n} rv" style="--d:${(0.288 + i * 0.024).toFixed(3)}s"><a href="${big}" aria-label="Ingrandisci: ${alt}"><picture>` +
    `<source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">` +
    `<img src="${big}" srcset="${set('jpg')}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${alt}"` +
    `${eager ? (i === 0 ? ' fetchpriority="high"' : '') : ' loading="lazy"'} decoding="async"></picture></a></figure>\n`;
  desk += `.p${n}{grid-column:${c1}/${c2};grid-row:${r1}/${r2}}\n`;
  mob += `  .p${n}{grid-column:${m1}/${m2};grid-row:${mr1}/${mr2}}\n`;
});
const mTotal = mr - M_GAP - 1;

const title = 'Alberto Orsini — Fotografia';
const desc = 'Portfolio fotografico di Alberto Orsini.';
const head = (t, d, url, extra = '') => `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="icon" href="${url ? '' : '/'}favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="${url ? '' : '/'}favicon.svg" sizes="any" type="image/svg+xml">
<link rel="apple-touch-icon" href="${url ? '' : '/'}apple-touch-icon.png">
<link rel="preload" href="fonts/Karla-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="style.css">
${extra}</head>`;
const og = `<link rel="canonical" href="${SITE}/">
<meta property="og:type" content="website"><meta property="og:locale" content="it_IT"><meta property="og:site_name" content="Alberto Orsini">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE}/"><meta property="og:image" content="${SITE}/images/og.jpg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${P[0][1]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F6F4EF">
<script>try{if(!matchMedia('(prefers-reduced-motion:reduce)').matches){var h=document.documentElement;h.classList.add('splash');setTimeout(function(){h.classList.add('loaded','finished','settled')},7000)}}catch(e){}</script>
`;
const page = `${head(title, desc, 'x', og)}
<body>
<a class="skip" href="#s02-griglia">Salta al contenuto</a>
<!-- 01 · Header -->
<header id="s01-header">
  <a class="site-name rv" href="https://albertorsini.it/" style="--d:0s">Alberto Orsini</a>
  <ul class="nav" aria-label="Contatti">
    <li class="rv" style="--d:.072s"><a href="https://www.instagram.com/albertorsini/" target="_blank" rel="noopener noreferrer" aria-label="Instagram (si apre in una nuova scheda)"><svg viewBox="0 0 17 17" aria-hidden="true"><rect x="1.5" y="1.5" width="14" height="14" rx="4"/><circle cx="8.5" cy="8.5" r="3.3"/><circle cx="12.4" cy="4.6" r=".6"/></svg></a></li>
    <li class="rv" style="--d:.096s"><a href="mailto:orsini.alberto@hotmail.it" aria-label="Scrivimi una email"><svg viewBox="0 0 17 17" aria-hidden="true"><rect x="1.5" y="3.5" width="14" height="10" rx="1"/><path d="M2 4.5l6.5 5 6.5-5"/></svg></a></li>
  </ul>
</header>
<main>
<h1 class="sr">Alberto Orsini — Fotografia</h1>
<!-- 02 · Griglia collage -->
<section id="s02-griglia" class="fluid" aria-label="Fotografie">
${html}</section>
</main>
<!-- 03 · Footer -->
<footer id="s03-footer">
  <p class="credit rv" style="--d:.432s">© 2026 Alberto Orsini</p>
</footer>
<button id="to-top" class="to-top" type="button" aria-label="Torna in alto" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg></button>
<script src="script.js" defer></script>
</body>
</html>
`;
await writeFile(root + 'site/index.html', page);

const css = await readFile(root + 'site/style.css', 'utf8');
const block = `/*GRID*/\n#s02-griglia{grid-template-rows:repeat(${dRows},var(--row))}\n${desk}@media (max-width:767px){\n  #s02-griglia{grid-template-rows:repeat(${mTotal},var(--row))}\n${mob}}\n/*END*/`;
await writeFile(root + 'site/style.css', css.replace(/\/\*GRID\*\/[\s\S]*?\/\*END\*\//, block));

const notFound = `${head('Pagina non trovata — Alberto Orsini', 'Pagina non trovata.', '')}
<body>
<header id="s01-header">
  <a class="site-name rv" href="https://albertorsini.it/" style="--d:0s">Alberto Orsini</a>
</header>
<main class="nf">
  <h1 class="rv" style="--d:.2s">Pagina non trovata</h1>
  <p class="rv" style="--d:.3s"><a href="/">Torna alla home</a></p>
</main>
</body>
</html>
`.replace('href="style.css"', 'href="/style.css"').replace('href="fonts/', 'href="/fonts/');
await writeFile(root + 'site/404.html', notFound.replace('<meta name="description" content="Pagina non trovata.">', '<meta name="description" content="Pagina non trovata."><meta name="robots" content="noindex">'));

await writeFile(root + 'site/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE}/</loc></url>\n</urlset>\n`);
await writeFile(root + 'site/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
