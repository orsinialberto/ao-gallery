# ao-gallery

Sito fotografico personale di Alberto Orsini: italiano, galleria, stile **Stampa** (dalla style library). Repository git locale, senza remote. Nessun hosting senza approvazione del board.

## Struttura
- `brief/` brief e materiali ricevuti · `audit/` audit · `content/` piano contenuti
- `images/source/` 30 foto originali (DSC*.jpg e IMG_*.jpg/jpeg, non rinominate) · `images/generated/` immagini generate + `prompts.md`
- `mockups/stampa/` DESIGN.md e preview originali dello stile (riferimento)
- `site/` sito di produzione (stile Stampa): `index.html` (collage di 30 foto), `404.html`, `style.css`, `tokens.css`, `sitemap.xml`, `robots.txt`, `favicon.svg`, font, `images/photos/` (AVIF/WebP/JPEG responsive, generate)
- `scripts/` check e anteprima

## Comandi (Node >= 20, nessuna dipendenza)
- `npm run preview` serve `site/` su http://127.0.0.1:4173/ (`npm run preview -- 8080` per altra porta); la home di partenza è `/`
- `npm run check` verifica file richiesti, 30 sorgenti, link/asset locali, sintassi JS

## Rigenerare immagini e pagina
- `npm i --no-save sharp` (solo build, non è una dipendenza del repo) → `node scripts/build-images.mjs` (da `images/source/` a `site/images/photos/`, 480/960/1600 px) → `node scripts/build-html.mjs` (`index.html`, layout collage in `style.css`, 404, sitemap, robots).
- Dominio di `sitemap.xml`/canonical/OG: `https://gallery.albertorsini.it`, costante `SITE` in `scripts/build-html.mjs`.

## Pubblicazione
Sito statico su GitHub Pages, dominio `gallery.albertorsini.it` (file `site/CNAME`). Ogni push su `main` avvia `.github/workflows/deploy.yml`, che esegue `npm run check` e pubblica `site/`.
Le foto originali (`images/source/`) non sono nel repository: restano in locale e servono solo a rigenerare le versioni responsive; quelle già generate sono in `site/images/photos/`.
DNS: record CNAME `gallery` verso `<utente-github>.github.io`; in Settings → Pages: custom domain e Enforce HTTPS.

## Note
- Stack: sito statico HTML/CSS/JS (ADR-001 non trovata nel repo: assunzione, da confermare col CTO).
- Il check attuale non include validazione HTML/Lighthouse: da estendere quando il Frontend avrà definito le pagine.
