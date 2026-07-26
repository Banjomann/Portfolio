import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      mode === 'test' ? 'test' : 'production',
    ),
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.js'],
  },
  build: {
    outDir: '../../wwwroot/showcases/react',
    emptyOutDir: true,
    minify: false,
    lib: {
      entry: 'src/main.jsx',
      formats: ['es'],
      fileName: 'react-showcase',
      cssFileName: 'react-showcase',
    },
  },
}))
