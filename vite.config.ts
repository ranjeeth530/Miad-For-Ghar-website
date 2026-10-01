import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'esnext',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
    server: {
      hmr: false,
      fs: {
        deny: ['./data/**', '**/.env*', '**/firebase-applet-config.json', '**/server.ts']
      },
      watch: {
        ignored: ['**/data/**', '**/data/**/*', '**/dist/**', '**/.git/**', '**/*.log'],
      },
    },
  };
});
