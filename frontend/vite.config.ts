import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,vue}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'Code Canvas',
        short_name: 'CodeCanvas',
        description: 'A minimal, aesthetic web code editor.',
        theme_color: '#1e1e1e',
        icons: [{ src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }, { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }]
      }
    })
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
});
