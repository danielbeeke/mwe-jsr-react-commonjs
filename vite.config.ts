import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { jsr } from './jsr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [jsr, react()],
  build: {
    target: 'esnext'
  },
  resolve: {
    alias: {
      lodash: 'lodash-es'
    }
  }
})
