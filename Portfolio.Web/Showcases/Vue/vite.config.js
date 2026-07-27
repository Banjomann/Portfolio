import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  plugins: [vue({ customElement: true })],
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      mode === 'test' ? 'test' : 'production',
    ),
  },
  test: {
    environment: 'jsdom',
  },
  server: {
    fs: {
      allow: ['..'],
    },
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
}))
