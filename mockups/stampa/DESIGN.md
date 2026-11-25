# Stile: Stampa

- **Slug:** `stampa`
- **Ispirato a:** [`references/arthur-fluid`](../../references/arthur-fluid/reference.md) — template Squarespace *Arthur* (Fluid Engine), demo https://arthur-fluid-demo.squarespace.com/
- **Tag:** settore: studio-creativo, cultura · mood: minimale, editoriale · layout: griglia-asimmetrica · tipografia: sans-grotesk, mono · palette: neutri-caldi, accento-singolo · motion: statico, scroll-reveal
- **Versione:** 1 — analisi (AOL-63) + build (2026-11-24, AOL-64). File: `preview.html` (home), `progetto.html#yoked|red-zone|louisa|saltwater` (slideshow), `about.html`, `style.css`, `script.js`, `tokens.css`, `fonts/`.
- **Uso previsto:** galleria fotografica personale di Alberto (sito da zero).

> Replica fedele della home (criterio di fedeltà): cambiano contenuti e palette. Stack originale: Squarespace 7.1 Fluid Engine, nessuna libreria di animazione, nessuna animazione allo scroll. Misure a 1440×900 e 390×844. Dati grezzi: `measure-*.json`; screenshot `screenshots/orig-*.jpg` (`orig-02-griglia-full.jpg` = home intera a 720 px; `orig-05-menu-mobile.jpg` = menu mobile, 2 stati).

## Mappa delle sezioni (ancore di `preview.html`)
| # | Originale | Ancora | Elementi | Media |
|---|---|---|---|---|
| 01 | `#header` (assoluto, scorre con la pagina, NON sticky; trasparente) | `#s01-header` | sx: nome "Arthur"; dx: About · Projects (dropdown) · Course · icona Instagram · icona mail. Niente carrello visibile in home | — |
| 02 | `#page` > un solo `.fluid-engine` (griglia a 24 col) | `#s02-griglia` | 6 immagini collage, posizionate a mano, ognuna link a pagina progetto. Nessun testo, nessun titolo, nessun hover | 6 foto |
| 03 | `#footer-sections` (217 px) | `#s03-footer` | etichetta "SIGN UP", campo email + bottone "SIGN UP", a dx "Made with Squarespace" (da sostituire con crediti/©) | — |
| — | Menu Projects aperto (desktop) | `#s01-header` stato | pannello bianco a destra sotto la voce | — |
| — | Menu mobile (overlay) | `#s01-header` stato | vedi sotto | — |
| — | Pagina progetto `/yoked` | `progetto.html` (build) | slideshow + titolo + riga mono | foto progetto |
| — | Pagina About `/about` | `about.html` (build) | testo, contatti, 3 foto | 3 foto |

Pagine interne: home → progetto (link di ogni foto, **le 6 foto linkano a 4 progetti**: yoked, red-zone, louisa, saltwater; yoked e red-zone compaiono due volte) → About → Course (pagina standard) . Nessun prev/next tra progetti: si naviga da menu o dalla home.

## Tipografia (tutti Google Fonts, OFL)
| Ruolo | Font | Misure |
|---|---|---|
| Nome sito / titolo pagina | **Karla** 400 | desktop 32,08 px / lh 36,96, tracking −0,01em (−0,32 px); mobile 14 px (nome in header) e 26,1 px (titolo progetto) |
| Nav, corpo, input, footer | Karla 400 | 12,544 px / lh 13,8, tracking +0,06em (0,75 px); paragrafo About 16 px / lh 17,6 tracking 0,75 px |
| Voci menu mobile / overlay | Karla 400 | 33,15 px, tracking 1,0 px (0,03em), nero |
| Bottone, "Skip to content" | **Space Mono** 400 | bottone 11,68 px MAIUSCOLO tracking −0,2336 px; skip 17,6 |
| Meta/contatti/riga progetto (blocchi code) | **IBM Plex Mono** 300 | 12,544 px / lh 12,544, tracking −0,02em (−0,25 px) |
Nota: gli "indizi" erano corretti per Karla; IBM Plex Mono è solo nei blocchi code (meta), i controlli UI usano Space Mono. Corpo sempre 12–16 px: la tipografia è **piccola e spaziata**, il titolo 32 px è il solo elemento grande.

## Colore (ruoli → originale → nostro)
| Ruolo | Originale | **Nostro** |
|---|---|---|
| `--paper` fondo | `#FFFFFF` | **`#F6F4EF`** |
| `--ink` testo, titoli | `#000000` | **`#1B1A17`** |
| `--muted` nav, voci dropdown, bottone | `#676767` | **`#5B6259`** |
| `--line` bordo input | `rgba(0,0,0,.12)` | **`rgba(27,26,23,.12)`** |
| `--surface` input / dropdown | `#FFFFFF` | **`#FFFFFF`** |
| `--on-muted` testo su bottone | `#FFFFFF` | **`#FFFFFF`** |
| overlay immagine (config, mai visibile) | `rgba(0,0,0,.5)` | non replicare |
**AA:** ink/paper 15,8; muted/paper 5,7; bianco su muted 6,3; ink/bianco 17,4. Niente accento cromatico: il colore sta nelle foto.

## Layout e misure
- **Griglia Fluid Engine** a 24 colonne: tracce `26` = bordo(39,125) + 24×45,28 + bordo(39,125) a 1440, **gap 11 px** colonne e righe; righe fisse 28,8 px (desktop) / 24 px (mobile), gap 11. Equivale a margine laterale ≈ 50 px (desktop) / 23 px (mobile), 24 col `1fr` (8 su mobile). Contenitore a tutta larghezza (1440, nessun max-width).
- `section` padding-top = altezza header: **124,875 px** desktop, **83,78 px** mobile (header assoluto sopra). Altezza griglia 2456 px (desktop), pagina 2798; mobile pagina 2074.
- **Header:** nome a x=50,y=43 (mobile x=23,y=33, 14 px); nav a destra, bordo destro x=1390; voci (12,5 px) a y=54, gap ≈20 px tra le voci (About 1138, Projects 1196, Course 1269), icone 17×17 a x=1336 e 1373. Colore nav `--muted`.
- **Dropdown Projects (desktop):** pannello bianco 225×88 a x=1036,y=48 (sotto la voce, spigoli vivi, niente ombra/bordo), padding 6,3/12,5 px, voci allineate **a destra**, 12,5 px `--muted` (lh 16,3), si apre su hover, righe 19 px.
- **Menu mobile:** overlay bianco a tutto schermo, header resta (nome + X sottile 1 px a dx, 24 px); voci centrate verticalmente (≈ y 372–518) a 33 px, passo 56 px; "Projects ›" con chevron 54 px sottile; apre un secondo pannello che scorre in orizzontale: bottone "‹ Back" (bordo 1 px) + 4 voci; icone Instagram/mail 25 px in basso (y≈856). Transizione overlay: visibility .6 s e opacity .4 s `cubic-bezier(.4,0,.2,1)`.
- **Footer:** altezza 217 (desktop) / 461 (mobile). Campo email 284×66 (x=50), bordo 1 px `--line`, fondo bianco, placeholder "Email Address" 12,5 px; bottone 112×64 a x=342 (desktop) fondo `--muted`, testo bianco, Space Mono 11,7 px maiuscolo; "Made with…" a destra (x=1277, 82×14, 12,5 px `--muted`). Mobile: input e bottone impilati (input 284×66 y=80, bottone 120×64 y=178), credit sotto a x=149,y=374.

### Collage home (linee di griglia colonna/riga; px = x,y(assoluta),w×h a 1440)
| # | File orig. (solo per soggetto) | Col | Riga | Box desktop | Ratio | Link | Soggetto |
|---|---|---|---|---|---|---|---|
| 1 | …4896564 (nat. 2:3, crop `object-position 45,2% 80%`) | 5/14 | 1/12 | 219,125 · 496×427 | 1,16 (orizz.) | /yoked | due cavalli in montagna |
| 2 | …3282699 (3:2, pos 47,9% 90,4%) | 2/15 | 18/30 | 50,801 · 721×467 | 1,54 | /red-zone | cielo rosso al tramonto con figura |
| 3 | …4414706 (3:2) | 20/26 | 5/16 | 1063,284 · 327×427 | 0,77 (vert.) | /louisa | ritratto in spiaggia, vento |
| 4 | …1155665 (3:2) | 18/24 | 21/27 | 951,921 · 327×228 | 1,43 | /saltwater | nuotatore nell'acqua |
| 5 | …1130640 (3:2) | 9/25 | 34/46 | 444,1438 · 890×467 | 1,91 | /yoked | figura contro cielo/nuvole |
| 6 | …4570369 (2:3) | 3/11 | 50/60 | 106,2075 · 439×387 | 1,13 | /red-zone | schiena con ombre di foglie |
**Mobile (10 linee, 8 col utili):** 1: col 2/7 riga 1/7 (210×199, y 84) · 2: 6/10, 8/15 (166×234) · 3: 2/9, 16/23 (299×234) · 4: 6/10, 24/28 (166×129) · 5: 2/10, 29/36 (343×234) · 6: 2/8, 37/45 (255×269). Stesso ordine, collage a zig-zag.
Tutte `object-fit:cover` (i riquadri hanno proporzioni diverse dai file: ritagli a mano via `object-position`). Immagini nel DOM già dimensionate a 1440 px di larghezza; nel build usare 1600–2000 px. Spazio bianco tra le foto ≈ 20–60% dell'altezza: **il vuoto è parte del design**. Hover: **nessuno** (cursor pointer, overlay nero 50% presente nel DOM con opacity 0 e mai attivato).

### Pagina progetto (`/yoked`)
- Griglia identica; prima sezione = galleria slideshow (padding-top 124,9): lista `1196×900` a x=122,y=154 (desktop; max ≈ 83% larghezza) e `293×343` (mobile), immagine `object-fit:contain` centrata (nessun ritaglio), una foto alla volta, **crossfade** (`visibility` + opacity, .6 s `cubic-bezier(.4,0,.2,1)`), cursor `grab` (drag/swipe).
- Controlli: due bottoni 27×32 ai lati (chevron 9×16, tratto 1 px, `opacity .75`, hover → 1, trans. .6 s), centrati in verticale, x=87 e 1326; aria "Previous/Next Slide". Miniature presenti ma nascoste (0×0). **Nessun lightbox** (nel DOM c'è solo il framework), nessun prev/next fra progetti.
- Sotto la galleria (y≈1082): titolo 32 px Karla (cols 2/18) + riga in IBM Plex Mono 300 12,5 px (cols 2/13, riga 3), 29 px di distanza.
- Dopo: footer identico.
### Pagina About (`/about`)
Griglia 24 col: testo p 16 px (cols 2/11, riga 1/3, 496 px di misura ≈ 60 car.); blocco code mono con email, telefono, indirizzo (cols 2/6, righe 4/7); 3 foto sfalsate: 14/23·1/9 (496×307), 20/25·10/15 (270×188), 15/19·12/19 (214×268, verticale).

## Motion ed effetti
| Effetto | Dettaglio | Reduced-motion |
|---|---|---|
| **Reveal d'ingresso** (unico) | al load ogni blocco `opacity 0→1`, **1,5 s `ease`**, ritardi a cascata: header (voci nav .0/.024/.048/.072 s…), immagini .288 / .312 / .336 / .36 / .384 / .408 s (+24 ms per blocco), footer .432–.504 s. Nessuno scroll-trigger: tutto parte al load (le immagini sotto la piega sono già in fade quando si scorre) | nessun fade |
| Dropdown Projects | apertura su hover, opacity breve (.1–.4 s linear/ease) | invariato |
| Menu mobile | overlay visibility .6 s + opacity .4 s `cubic-bezier(.4,0,.2,1)`; burger ↔ X | invariato |
| Slideshow | crossfade .6 s `cubic-bezier(.4,0,.2,1)`; controlli opacity .6 s | taglio netto |
| Hover immagini home | **nessuno** | — |
| Transizioni di pagina | nessuna (caricamento normale) | — |
| Parallax / cursore / smooth scroll | assenti | — |

## Immagini demo (da cercare su Unsplash/Pexels, taglio coerente)
Fotografia d'autore, toni naturali: 1) due animali (cavalli/asini) in alta montagna, orizzontale; 2) cielo drammatico rosso/arancio con figura piccola, orizzontale ampia (≥1,9:1); 3) ritratto verticale in spiaggia al tramonto; 4) persona che nuota (acqua blu, piccolo formato); 5) figura contro nuvole, orizzontale; 6) dettaglio schiena/pelle con ombre di foglie (verticale). Per la galleria del progetto: 5–8 foto per 3–4 progetti, mix verticale/orizzontale. Totale demo: 6 per home + ~8 per progetti + 3 About (riutilizzabili).

## Differenze dall'originale
- Contenuti: "Arthur" → "Matteo Ferri"; progetti Yoked/Red Zone/Louisa/Saltwater → Alta Quota/Zona Rossa/Lia/Salsedine (slug ancore invariati); menu "About/Projects/Course" → "Chi sono/Progetti/Contatti"; footer "SIGN UP" → "Iscriviti", "Made with Squarespace" → © 2026; testi About/contatti inventati. Foto Unsplash (vedi `CREDITS.md`), stessi soggetti per ruolo; ritagli via `object-position`.
- Palette: bianco/nero/#676767 → `#F6F4EF` / `#1B1A17` / `#5B6259` (tokens.css, AA documentato).
- Font: identici (Karla, Space Mono, IBM Plex Mono, OFL), self-hosted in `fonts/` (subset latin).
- Non replicati: badge "Create a site like this", carrello, cookie bar; la pagina Course è sostituita da Contatti (ancora in About). Menu mobile: transizioni replicate a stima (orig. misurato solo overlay .6/.4 s). Slideshow: frecce, tastiera, swipe/drag, crossfade .6 s; niente miniature (nascoste anche nell'originale). Foto progetto/About: 3–4 per progetto, riusate dalla home.
- Reduced-motion: reveal d'ingresso, crossfade e transizioni menu disattivati (stato finale immediato).
- Header assoluto non sticky (fedele); l'overlay mobile resta fisso.
