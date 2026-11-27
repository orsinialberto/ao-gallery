# Reveal allo scroll nella homepage — design breve

## Intento
Scorrendo la homepage, ogni foto compare con un movimento discreto. Il visore (dettaglio) non cambia.

## Comportamento
- Quando entra nello schermo, la foto passa da opacity 0 a 1 e sale di 24px: 0,8s, `cubic-bezier(.22,1,.36,1)`.
- Scatta quando la foto supera il 12% inferiore dello schermo (`rootMargin: 0px 0px -12% 0px`).
- Una sola volta per foto. Nessun ritardo aggiunto: lo sfalsamento viene dal collage.
- Parte solo dopo che l'immagine è caricata e decodificata. Se il caricamento fallisce, o non finisce entro 2,5s, il riquadro si mostra comunque.
- Stessi valori su desktop e mobile.

## Non obiettivi
Parallasse, tendina, librerie, modifiche a splash, visore o layout.

## Approcci
- **A. Reveal (scelto sul mockup `mockups/scroll/preview.html`):** calmo, non compete con le foto; effetto comune.
- **B. Tendina:** più carattere; con 31 foto può stancare.
- **C. Parallasse:** più profondità; movimento continuo, rende meno su mobile.

Tecnica: `IntersectionObserver`. Scartato `animation-timeline: view()`, che lega l'effetto alla posizione di scroll e ha supporto non uniforme tra browser.

## Come (scelte mie)
- Modifiche solo in `site/script.js` e `site/style.css` (fuori dal blocco `/*GRID*/`). Nessuna rigenerazione.
- Si anima il link `a` dentro il `figure`, perché splash usa `transform` e `opacity` del `figure`. Sulle sole foto in reveal, `figure` non ritaglia e non mostra lo sfondo grigio.
- Con splash attivo, il reveal si prepara dopo la classe `settled`. Prima nasconderebbe le foto che volano fuori schermo.
- Al momento della preparazione si nascondono solo le foto interamente sotto lo schermo. Quelle già visibili restano ferme.
- Se si scorre durante la fine dello splash, le foto già raggiunte compaiono senza reveal.
- Con "riduci movimento", senza JavaScript o senza `IntersectionObserver`: foto subito visibili. Lo stato nascosto lo aggiunge solo lo script.

## Verifica
- `npm run check`.
- Nel browser, desktop e larghezza mobile: caricamento con splash, scroll lento e veloce, ritorno in alto, apertura del visore, navigazione da tastiera, "riduci movimento".
