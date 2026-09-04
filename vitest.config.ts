import { defineConfig } from 'vitest/config'

// A lightweight test setup, separate from vite.config.ts so the build plugins
// (Tailwind, prerender, SW stamping) don't load during unit tests. The starter
// suite covers pure logic and runs in a plain Node environment.
export default defineConfig({
  // Stand in for the build-time constants that vite.config.ts injects, so modules
  // that transitively import lib/version.ts can load under test.
  define: {
    __APP_VERSION__: '"test"',
    __BUILD_TIME__: '"test"',
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
