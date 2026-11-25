// Check del repository (zero dipendenze): file richiesti, 30 sorgenti, link/asset locali di site/ risolvibili, JS valido.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const errors = [];
const exists = (p) => stat(p).then(() => true, () => false);
const walk = async (d) => (await Promise.all((await readdir(d, { withFileTypes: true })).map((e) => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]))).flat();

for (const f of ['README.md', 'CREDITS.md', 'site/tokens.css', 'mockups/stampa/DESIGN.md', 'site/index.html', 'site/404.html', 'site/sitemap.xml', 'site/robots.txt', 'site/favicon.svg', 'site/images/og.jpg'])
  if (!(await exists(join(root, f)))) errors.push(`File mancante: ${f}`);

// gli originali (images/source/) sono solo locali, non nel repository: il controllo vale solo se la cartella c'è
if (await exists(join(root, 'images/source'))) {
  const src = (await readdir(join(root, 'images/source'))).filter((f) => /\.jpe?g$/i.test(f));
  if (src.length !== 30) errors.push(`images/source: attesi 30 JPG, trovati ${src.length}`);
}

const site = join(root, 'site');
for (const file of await walk(site)) {
  if (file.endsWith('.md')) errors.push(`File .md non ammesso in site/: ${file.replace(root, '')}`);
  if (/\.(html|css|xml|txt)$/.test(file)) {
    const hit = (await readFile(file, 'utf8')).match(/SIGN UP|Projects|progetto\.html|about\.html|Squarespace|Arthur|Unsplash/);
    if (hit) errors.push(`Residuo del mockup "${hit[0]}" in ${file.replace(root, '')}`);
  }
  if (file.endsWith('.js')) {
    try { execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }); } catch (e) { errors.push(`JS non valido: ${file}`); }
  }
  if (!file.endsWith('.html')) continue;
  const html = await readFile(file, 'utf8');
  const urls = [...html.replace(/<link rel="canonical"[^>]*>/, '').replace(/(<a\b[^>]*?)\bhref="https?:[^"]*"/g, '$1').matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const [, set] of html.matchAll(/srcset="([^"]+)"/g)) urls.push(...set.split(',').map((x) => x.trim().split(/\s+/)[0]));
  for (const url of urls) {
    if (/^(mailto:|tel:|data:|#|javascript:)/.test(url)) continue;
    if (/^https?:/.test(url)) { errors.push(`Risorsa esterna: ${url} in ${file.replace(root, '')}`); continue; }
    const clean = url.split('#')[0].split('?')[0];
    const path = clean.startsWith('/') ? join(site, clean) : resolve(dirname(file), clean);
    if (!(await exists(path))) errors.push(`Link/asset non risolvibile: ${url} in ${file.replace(root, '')}`);
  }
  if (!/<html lang="it"/.test(html)) errors.push(`lang="it" mancante in ${file.replace(root, '')}`);
  // il nome in alto porta all'hub; nella pagina con le foto c'è la freccia per tornare in cima (visibile solo con JS)
  if (!html.includes('<a class="site-name rv" href="https://albertorsini.it/"')) errors.push(`Il nome non porta all'hub in ${file.replace(root, '')}`);
  if (html.includes('id="s02-griglia"') && !/<button id="to-top"[^>]*aria-label="Torna in alto"[^>]*\shidden>/.test(html)) errors.push(`Freccia "torna in alto" mancante in ${file.replace(root, '')}`);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g))
    if (!/ alt="[^"]+"/.test(tag) || !/ width="\d+"/.test(tag) || !/ height="\d+"/.test(tag)) errors.push(`img senza alt/width/height: ${tag.slice(0, 80)}`);
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('check OK');
