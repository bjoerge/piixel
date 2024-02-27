const {defineConfig} = await import('vitest/config')

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
    },
  },
})
