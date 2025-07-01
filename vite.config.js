import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './src',  // Set src as root directory
  publicDir: '../public',  // Point to public directory
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        project: resolve(__dirname, 'src/project-details.html')
      }
    }
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: true  // Automatically open browser
  },
  optimizeDeps: {
    include: ['three'],
    exclude: ['three/examples/jsm/controls/OrbitControls']
  }
});