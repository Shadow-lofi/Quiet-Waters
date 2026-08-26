// Generate the Quiet Waters QR code as a crisp SVG asset for the /churches
// page and the printable flyer. Encodes the app's front door so a scan drops
// someone straight into stillness. Run: npm run gen:qr
import QRCode from 'qrcode'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { writeFileSync } from 'node:fs'

const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), '../public')
const URL = 'https://quiet-waters-meditation.com'

// Deep "Still Waters" modules on white — high contrast for reliable scanning,
// crisp at any print size because it's vector.
const svg = await QRCode.toString(URL, {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 1,
  color: { dark: '#15303a', light: '#ffffff' },
})

writeFileSync(resolve(publicDir, 'qr-quiet-waters.svg'), svg)
console.log('wrote public/qr-quiet-waters.svg →', URL)
