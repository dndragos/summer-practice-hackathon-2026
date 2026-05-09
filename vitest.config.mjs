import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Change to 'jsdom' if testing React components in the future
    setupFiles: [], // Add setup files here if needed
  },
})
