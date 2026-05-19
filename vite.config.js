import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

   server: {
    host: '147.102.246.150',
    // host: '147.102.75.206',
    port: 5173,
    https: {
      // key: fs.readFileSync('/home/ltsp/147.102.246.150+2-key.pem'),
      // cert: fs.readFileSync('/home/ltsp/147.102.246.150+2.pem')
      key: fs.readFileSync('./147.102.246.150+2-key.pem'),
      cert: fs.readFileSync('./147.102.246.150+2.pem')
    }
    //https: false  // localhost works without HTTPS
  }
})
