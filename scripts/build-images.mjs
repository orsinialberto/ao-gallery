// Genera le immagini responsive di site/images/photos/ da images/source/ (AVIF + WebP + JPEG, sRGB, senza EXIF).
// Strumento di build opzionale: richiede `sharp` fuori dal repo -> `npm i --no-save sharp` (node_modules è ignorato da git).
import { readdir, mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const { default: sharp } = await import('sharp').catch(() => { console.error('Manca sharp: esegui `npm i --no-save sharp`'); process.exit(1); });
const root = fileURLToPath(new URL('../', import.meta.url));
const src = join(root, 'images/source'), out = join(root, 'site/images/photos');
const WIDTHS = [480, 960, 1600];
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const manifest = {};
for (const f of (await readdir(src)).filter((f) => /\.jpe?g$/i.test(f)).sort()) {
  const name = f.replace(/\.jpe?g$/i, '');
  const img = sharp(join(src, f)).rotate();
  const { width, height } = await img.metadata();
  const [w0, h0] = (await sharp(await img.clone().toBuffer()).metadata()).orientation > 4 ? [height, width] : [width, height];
  const ws = [...new Set(WIDTHS.filter((w) => w < w0))].sort((a, b) => a - b);
  for (const w of ws) {
    const r = img.clone().resize({ width: w, withoutEnlargement: true }).toColourspace('srgb').withIccProfile('srgb');
    await Promise.all([
      r.clone().avif({ quality: 50, effort: 5 }).toFile(join(out, `${name}-${w}.avif`)),
      r.clone().webp({ quality: 76, effort: 5 }).toFile(join(out, `${name}-${w}.webp`)),
      r.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(join(out, `${name}-${w}.jpg`)),
    ]);
  }
  manifest[name] = { width: w0, height: h0, widths: ws, h: ws.map((w) => Math.round((w * h0) / w0)) };
  console.log(name, w0 + 'x' + h0, ws.join(','));
}
await writeFile(join(root, 'images/manifest.json'), JSON.stringify(manifest, null, 1));
