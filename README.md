# ao-gallery

Sito fotografico personale di Alberto Orsini: italiano, galleria, stile **Stampa** (dalla style library). Online su https://gallery.albertorsini.it
(repository https://github.com/orsinialberto/ao-gallery, pubblicato con GitHub Pages).

## Struttura
- `brief/` brief e materiali ricevuti · `audit/` audit · `content/` piano contenuti
- `images/source/` 30 foto originali (DSC*.jpg e IMG_*.jpg/jpeg, non rinominate). **Solo locale: ignorata da git, non è nel repository**
- `images/generated/` immagini generate + `prompts.md`
- `mockups/stampa/` DESIGN.md e preview originali dello stile (riferimento)
- `site/` sito di produzione (è la cartella pubblicata): `index.html` (collage di 30 foto), `404.html`, `style.css`, `tokens.css`, `script.js` (splash d'ingresso e visore), `sitemap.xml`, `robots.txt`, `CNAME`, favicon, font, `images/photos/` (AVIF/WebP/JPEG responsive, **generate e committate**)
- `scripts/` build, check e anteprima
- `.github/workflows/deploy.yml` deploy

## Comandi (Node >= 20, nessuna dipendenza)
- `npm run preview` serve `site/` su http://127.0.0.1:4173/ (`npm run preview -- 8080` per altra porta)
- `npm run check` verifica file richiesti, link/asset locali, sintassi JS; i 30 sorgenti solo se `images/source/` esiste (in CI non c'è)

## Come si modifica il sito
`site/index.html` e il blocco `/*GRID*/…/*END*/` di `site/style.css` sono **generati** da `scripts/build-html.mjs`: non modificarli a mano.
Elenco foto, testi alternativi, layout del collage (liste `GROUPS` e `M_SPAN`), dominio (`SITE`), meta tag, 404, sitemap e robots stanno in quello script.
Dopo ogni modifica: `node scripts/build-html.mjs` poi `npm run check`. Stile, splash e visore si modificano direttamente in `site/style.css` e `site/script.js`.

## Aggiungere o cambiare foto
1. Copia i nuovi originali in `images/source/` (solo locale).
2. `npm i --no-save sharp` (serve solo qui, non è una dipendenza del repo) → `node scripts/build-images.mjs` (genera `site/images/photos/` e `images/manifest.json`, a 480/960/1600 px in AVIF/WebP/JPEG).
3. Aggiungi la foto (nome file, testo alternativo in italiano) all'elenco `P` di `scripts/build-html.mjs`, il suo posto in `GROUPS` (max 2 foto per riga) e un valore in `M_SPAN`; aggiorna il numero atteso (30) in `scripts/check.mjs` e nei testi.
4. `node scripts/build-html.mjs` → `npm run check` → commit di `site/` e `images/manifest.json`.
**La CI non rigenera le immagini**: pubblica solo ciò che è committato in `site/`.

## Pubblicazione
- Ogni **push su `main`** avvia `.github/workflows/deploy.yml`: esegue `npm run check` e, se passa, pubblica `site/` su GitHub Pages. Se il check fallisce il sito online non cambia. Gli altri branch non avviano nulla; il workflow si può rilanciare a mano da Actions (`workflow_dispatch`).
- Dominio `gallery.albertorsini.it`: file `site/CNAME`; record DNS `CNAME gallery` → `orsinialberto.github.io`; in Settings → Pages: Source "GitHub Actions", custom domain ed Enforce HTTPS. Se cambia il dominio: aggiorna `SITE` in `scripts/build-html.mjs`, `site/CNAME` e rigenera.
- Cronologia: `main` è stato ricreato con un solo commit per non caricare gli originali (391 MB). La cronologia completa è nei branch **locali** `archivio-sviluppo` e `archivio-main`; non vanno pubblicati.

## Note
- Stack: sito statico HTML/CSS/JS, nessun framework, nessun tracking, nessuna risorsa esterna (font self-hosted). Il `check` rifiuta risorse esterne (i soli link cliccabili esterni sono ammessi).
- Il check non include validazione HTML né Lighthouse.
- Splash d'ingresso e visore a miniature sono ispirati al comportamento di gregorcollienne.com (solo il comportamento, nessun codice o asset copiato); tempi e curve in `site/script.js` e `site/style.css`.
