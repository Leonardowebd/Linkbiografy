import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      png: { quality: 80 },
      webp: { lossless: false, quality: 80 },
      includePublic: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // Target modern browsers — smaller, faster output
    target: 'es2020',

    // Inline assets < 4 KB (avoids round-trips for tiny files)
    assetsInlineLimit: 4096,

    // Single CSS file — one fewer network request
    cssCodeSplit: false,

    // Clean dist on every build
    emptyOutDir: true,

    // Skip compressed-size reporting — faster CI builds
    reportCompressedSize: false,

    rollupOptions: {
      output: {
        // Stable chunk names for better long-term caching
        manualChunks: {
          'vendor-react':  ['react', 'react-dom'],
          'vendor-motion': ['motion'],
        },
        // Hash-based asset names for cache busting
        chunkFileNames:  'assets/[name]-[hash].js',
        entryFileNames:  'assets/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]',
      },
    },
  },
})
