import { defineConfig } from 'vitest/config'

// A lightweight test setup, separate from vite.config.ts so the build plugins
// (Tailwind, prerender, SW stamping) don't load during unit tests. The starter
// suite covers pure logic and runs in a plain Node environment.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
