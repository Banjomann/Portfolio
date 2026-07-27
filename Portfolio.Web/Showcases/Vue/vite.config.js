import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({ customElement: true })],
  test: {
    environment: 'jsdom',
  },
  build: {
    outDir: '../../wwwroot/showcases/vue',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: 'src/main.js',
      formats: ['es'],
      fileName: 'vue-showcase',
    },
  },
})

