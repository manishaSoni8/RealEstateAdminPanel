import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: false,
    port: 5173,
    allowedHosts: [
      'realestateadminpanel-1-ioxn.onrender.com',
      'realestateadminpanel-45v0.onrender.com'
    ],
    cors: true
  },
  define: {
    'process.env.VITE_BASE_URL': JSON.stringify('https://realestateadminpanel-45v0.onrender.com')
  },
  preview: {
    port: 3005,
    host: true,
    strictPort: true,
    allowedHosts: [
      'realestateadminpanel-1-ioxn.onrender.com',
      'realestateadminpanel-45v0.onrender.com'
    ]
  }
})