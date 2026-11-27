# Reveal allo scroll nella homepage — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ogni foto della homepage compare con un reveal discreto quando entra nello schermo.

**Architecture:** Un nuovo blocco autonomo in fondo a `site/script.js` assegna lo stato nascosto alle foto sotto lo schermo e le mostra con `IntersectionObserver`. `site/style.css` definisce i due stati. HTML e script di build non cambiano.

**Tech Stack:** HTML/CSS/JS statico, nessuna dipendenza, Node >= 20.

**Spec:** `docs/superpowers/specs/2026-11-27-reveal-scroll-home-design.md`

## Global Constraints

- Modifiche solo in `site/script.js` e `site/style.css`, fuori dal blocco `/*GRID*/…/*END*/`.
- Opacity 0→1 e salita di 24px, 0,8s, `cubic-bezier(.22,1,.36,1)`, `rootMargin: '0px 0px -12% 0px'`.
- Una sola volta per foto, nessun ritardo aggiunto, stessi valori su desktop e mobile.
- Nessuna libreria. Splash, visore e layout invariati.
- Lo stato nascosto lo aggiunge solo lo script.
- Commit solo se l'utente lo chiede.

## Review Focus

- Salto in fondo o scroll molto veloce: le foto saltate compaiono quando si torna su; nessuna resta invisibile sullo schermo.
- Tab da tastiera su una foto non ancora mostrata: la pagina scorre e la foto compare.
- "Riduci movimento" attivato a pagina già aperta: le foto nascoste diventano visibili.
- Stampa senza aver scorso la pagina: tutte le foto sono presenti.
- Immagine che non si carica: il riquadro viene mostrato comunque.

---

### Task 1: Reveal allo scroll

**Files:**
- Modify: `site/script.js` (nuovo blocco in fondo al file)
- Modify: `site/style.css` (nuovo blocco `02b` dopo `/*END*/`; regole nel blocco `prefers-reduced-motion`)
- Test: script usa e getta nella cartella temporanea della sessione (il repo non ha un framework di test)

**Interfaces:**
- Consumes: `#s02-griglia .ph`; le classi `splash` e `settled` su `<html>`.
- Produces: le classi `reveal-wait` (nascosta) e `reveal-in` (in comparsa o comparsa) sul `figure`.

- [ ] **Step 1: Scrivi la verifica**

Script Node che apre la pagina in Chrome headless (servita da `npm run preview`), a 1440×900 e 390×844. Dopo almeno 8s dal caricamento controlla:

```js
const figs = [...document.querySelectorAll('#s02-griglia .ph')];
const op = (f) => getComputedStyle(f.querySelector('a')).opacity;
// prima dello scroll
figs.filter(f => f.getBoundingClientRect().top >= innerHeight)
    .every(f => f.classList.contains('reveal-wait') && op(f) === '0');          // true
figs.filter(f => f.getBoundingClientRect().top < innerHeight)
    .every(f => !f.classList.contains('reveal-wait') && op(f) === '1');         // true
// dopo scroll a passi di mezzo schermo fino in fondo, più 2s
figs.every(f => !f.classList.contains('reveal-wait') && op(f) === '1');         // true
```

Casi aggiuntivi, uno per voce di Review Focus:

| Caso | Asserzione |
|---|---|
| salto in fondo, poi risalita a passi | alla fine nessuna `.reveal-wait` |
| `focus()` sul link di una foto nascosta | entro 2s opacity `1` |
| emulazione `prefers-reduced-motion: reduce` dopo il caricamento | tutte opacity `1` |
| emulazione media `print` senza scroll | tutte opacity `1` |
| richieste immagine bloccate, poi scroll | nessuna `.reveal-wait` tra le foto raggiunte |

Caso "riduci movimento" attivo dal caricamento: nessuna `figure` ha `reveal-wait` o `reveal-in`.

- [ ] **Step 2: Esegui la verifica e controlla che fallisca**

Atteso: FAIL sulla prima asserzione (nessuna foto ha `reveal-wait`).

- [ ] **Step 3: Aggiungi il CSS**

- `.fluid .ph.reveal-wait, .fluid .ph.reveal-in`: `overflow:visible; background:none`.
- `.fluid .ph.reveal-wait a`: `opacity:0; transform:translateY(24px)`.
- `.fluid .ph.reveal-in a`: transizione di `opacity` e `transform` con i valori dei Global Constraints.
- In `@media (prefers-reduced-motion:reduce)` e in un nuovo `@media print`: `.reveal-wait a` visibile (`opacity:1; transform:none`) e nessuna transizione. La specificità deve battere le regole sopra.

- [ ] **Step 4: Aggiungi il blocco in `site/script.js`**

IIFE con commento in italiano, come le altre. Comportamento:

1. Esce se non ci sono foto, se manca `IntersectionObserver` o se "riduci movimento" è attivo.
2. Funzione `arm()`: aggiunge `reveal-wait` solo alle foto con `getBoundingClientRect().top >= innerHeight` e le osserva.
3. All'intersezione: smette di osservare, imposta `img.loading = 'eager'`, attende `img.decode()` (anche se fallisce), poi sostituisce `reveal-wait` con `reveal-in`.
4. Se `<html>` ha `splash` senza `settled`, chiama `arm()` quando compare `settled` (`MutationObserver` sull'attributo `class`, poi disconnesso). Altrimenti la chiama subito.

- [ ] **Step 5: Esegui le verifiche**

Run: lo script dello Step 1. Atteso: tutte le asserzioni `true` in entrambe le dimensioni.

Run: `npm run check`. Atteso: exit 0.

- [ ] **Step 6: Controllo visivo**

Screenshot desktop e mobile a metà pagina; apertura e chiusura del visore su una foto comparsa con il reveal. Atteso: nessun riquadro grigio, nessuna foto tagliata, visore invariato. La fluidità del movimento e il telefono vero li giudica l'utente con `npm run preview`.
