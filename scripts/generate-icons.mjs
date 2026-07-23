/**
 * Generates PWA icons from public/brand/logo.png.
 * Run once after cloning or when the logo changes:
 *   node scripts/generate-icons.mjs
 *
 * Outputs to public/icons/:
 *   icon-192.png          — standard 192×192
 *   icon-512.png          — standard 512×512
 *   icon-maskable-192.png — maskable with 10% safe-zone padding, 192×192
 *   icon-maskable-512.png — maskable with 10% safe-zone padding, 512×512
 */

import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, 'public', 'brand', 'logo.png');
const out = join(root, 'public', 'icons');

await mkdir(out, { recursive: true });

const sizes = [192, 512];

for (const size of sizes) {
  // Standard icon — full bleed
  await sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toFile(join(out, `icon-${size}.png`));
  console.log(`✓ icon-${size}.png`);

  // Maskable icon — add 10% padding on each side so the logo sits in the safe zone
  const padding = Math.round(size * 0.1);
  const logoSize = size - padding * 2;
  await sharp(src)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 31, g: 41, b: 71, alpha: 1 }, // matches theme_color #1f2947
    })
    .toFile(join(out, `icon-maskable-${size}.png`));
  console.log(`✓ icon-maskable-${size}.png`);
}

console.log('\nAll icons written to public/icons/');
