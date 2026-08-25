// Rasterize the app icons from an inline SVG (drop + ripples on a water
// gradient) into the PNGs the manifest and iOS need, plus the og-card.png share
// preview from public/og-card.svg. Run: npm run gen:icons
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readFileSync } from 'node:fs'

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), '../public')

const gradient = `<defs>
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#46b0c3"/>
    <stop offset="1" stop-color="#215f70"/>
  </linearGradient>
</defs>`

// Drop + ripples, centered, scaled around (32,33) so it sits nicely inside the
// maskable safe zone when scaled down.
const mark = (scale) => `<g transform="translate(32 33) scale(${scale}) translate(-32 -33)">
  <ellipse cx="32" cy="45" rx="19" ry="5.5" fill="none" stroke="#dff2f6" stroke-width="2.4" opacity="0.5"/>
  <ellipse cx="32" cy="45" rx="11" ry="3.8" fill="none" stroke="#ffffff" stroke-width="2.4" opacity="0.85"/>
  <path d="M32 11C32 11 43 24 43 32a11 11 0 1 1-22 0C21 24 32 11 32 11z" fill="#ffffff"/>
  <circle cx="27.5" cy="29" r="3" fill="#9bd6e1" opacity="0.7"/>
</g>`

const svg = ({ rx, scale }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${gradient}` +
  `<rect width="64" height="64" rx="${rx}" fill="url(#g)"/>${mark(scale)}</svg>`

const jobs = [
  { file: 'icon-192.png', size: 192, svg: svg({ rx: 14, scale: 0.84 }) },
  { file: 'icon-512.png', size: 512, svg: svg({ rx: 14, scale: 0.84 }) },
  { file: 'icon-maskable-512.png', size: 512, svg: svg({ rx: 0, scale: 0.62 }) },
  { file: 'apple-touch-icon.png', size: 180, svg: svg({ rx: 0, scale: 0.82 }) },
  { file: 'favicon-32.png', size: 32, svg: svg({ rx: 14, scale: 0.86 }) },
  { file: 'favicon-16.png', size: 16, svg: svg({ rx: 8, scale: 0.9 }) },
]

for (const job of jobs) {
  await sharp(Buffer.from(job.svg))
    .resize(job.size, job.size)
    .png()
    .toFile(resolve(publicDir, job.file))
  console.log(`✓ ${job.file} (${job.size}×${job.size})`)
}

// Social share card (1200×630) from the authored SVG.
const ogSvg = readFileSync(resolve(publicDir, 'og-card.svg'))
await sharp(ogSvg).resize(1200, 630).png().toFile(resolve(publicDir, 'og-card.png'))
console.log('✓ og-card.png (1200×630)')
