import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
})
