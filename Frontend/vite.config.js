import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 3005
  },
  define: {
    'process.env.BASE_URL': JSON.stringify('https://realestateadminpanel-2.onrender.com')
  }
})
 
