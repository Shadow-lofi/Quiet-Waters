import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'

// App version (from package.json) + this build's timestamp, baked into the
// bundle so the About screen can show what's running (see src/lib/version.ts).
const APP_VERSION = (
  JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string }
).version
const BUILD_TIME = new Date().toISOString()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
  },
  server: {
    port: Number(process.env.PORT) || 5273,
    host: true,
  },
})
