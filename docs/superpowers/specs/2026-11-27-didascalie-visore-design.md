# Didascalie nel visore

## Scopo
Dare a ogni foto un numero e un titolo discreti; vari titoli indicano i luoghi visitati.

## Obiettivi e limiti
- Didascalia solo nel visore, nel formato `07 — Titolo`.
- Collage e testi alternativi restano invariati.
- La didascalia deve restare leggera e non competere con la foto.
- Sito statico senza dipendenze né risorse esterne; nessun font nuovo.

## Approcci
- **Solo nel visore (scelto):** il collage resta pulito e il testo compare quando ci si ferma su una foto.
- **Anche nel collage (scartato):** richiede di rivedere le spaziature e 30 scritte rischiano di dare un aspetto da catalogo.

## Progetto
- Posizione: centrata sotto la foto grande; su telefono tra la foto e la fila di miniature.
- Aspetto: testo piccolo, colore `--color-text-muted`. Cambia insieme alla foto attiva.
- Numero: automatico dall'ordine del collage, a due cifre. Inserendo una foto in mezzo, i numeri successivi scorrono.
- Titoli: nell'elenco `P` di `scripts/build-html.mjs`, accanto a nome file e testo alternativo. `site/index.html` si rigenera.

## Titoli
01 Tramonto a Tam Coc · 02 Filamento · 03 Dopo la pioggia · 04 Malghette · 05 L’inquilino · 06 Rifugio Denza · 07 Mu Cang Chai · 08 Lan Ha Bay · 09 La presa · 10 Riflessi d’oro · 11 Raccolto · 12 Rosa sul grigio · 13 Sentieri d’acqua · 14 Mua Cave · 15 La via del fiume · 16 Il mulino · 17 Precedenza · 18 L’attesa · 19 Il guardiano · 20 Hoi An · 21 Nel verde · 22 Cielo in terra · 23 Val d’Orcia · 24 Fino all’oceano · 25 Luci all’angolo · 26 Alba ad Angkor Wat · 27 L’ultima onda · 28 Borghi Silenti · 29 Padroni di casa · 30 Aperto fino a tardi · 31 Mare di nebbia

## Scelte lasciate a chi realizza
Font tra quelli presenti, corpo e spaziature, e come far leggere il titolo agli screen reader.
