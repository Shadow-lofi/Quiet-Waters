import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// App version (from package.json) + this build's timestamp, baked into the
// bundle so the Updates page can show what's running (see src/lib/version.ts).
const APP_VERSION = (
  JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string }
).version
const BUILD_TIME = new Date().toISOString()

// Stamp a content-derived build id into the service worker's cache name, so a
// deploy that actually changes assets gets a new cache — which is what lets the
// worker detect an update and offer the "a new version is ready" prompt (see
// public/sw.js + lib/swUpdate.ts). A rebuild with identical output keeps the same
// id, so it never nags about a "new version" that isn't one.
function stampServiceWorker(): Plugin {
  let root = process.cwd()
  let outDir = 'dist'
  let hash = APP_VERSION
  return {
    name: 'stamp-sw',
    apply: 'build',
    configResolved(cfg) {
      root = cfg.root
      outDir = cfg.build.outDir
    },
    generateBundle(_opts, bundle) {
      // Hash the set of emitted asset filenames (each is content-hashed by Vite),
      // so the id changes exactly when the build output changes.
      const names = Object.keys(bundle)
        .filter((n) => !n.endsWith('.map'))
        .sort()
      const digest = createHash('sha256').update(names.join('|')).digest('hex').slice(0, 8)
      hash = `${APP_VERSION}-${digest}`
    },
    closeBundle() {
      const swPath = resolve(root, outDir, 'sw.js')
      const sw = readFileSync(swPath, 'utf8').replace(
        "const CACHE = 'quiet-waters-dev'",
        `const CACHE = 'quiet-waters-${hash}'`,
      )
      writeFileSync(swPath, sw)
      // eslint-disable-next-line no-console
      console.log(`sw.js: cache quiet-waters-${hash}`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), stampServiceWorker()],
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
  },
  server: {
    port: Number(process.env.PORT) || 5273,
    host: true,
  },
})
