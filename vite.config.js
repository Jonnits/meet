import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/meet/',
  plugins: [
    react(),
    VitePWA({
      manifest: {
        "short_name": "Meet App",
        "name": "Meet - Event Discovery App",
        "icons": [
            {
            "src": "favicon.ico",
            "sizes": "48x48",
            "type": "image/x-icon",
            "purpose": "maskable"
            },
            {
            "src": "meet-app-144.png",
            "type": "image/png",
            "sizes": "144x144",
            "purpose": "any"
            },
            {
            "src": "meet-app-192.png",
            "type": "image/png",
            "sizes": "192x192",
            "purpose": "maskable"
            },
            {
            "src": "meet-app-512.png",
            "type": "image/png",
            "sizes": "512x512",
            "purpose": "maskable"
            }
        ],
        "start_url": ".",
        "display": "standalone",
        "theme_color": "#000000",
        "background_color": "#ffffff"
      },
      srcDir: 'src', 
      filename: 'service-worker.js',
      scope: '/meet/',
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/.*\.png$/, 
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
              },
            },
          },
        ],
      },
    })
  ],
})