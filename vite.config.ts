import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { jsr } from './jsr'
import commonjs from 'vite-plugin-commonjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [commonjs({
    filter(id) {
      if (id.includes('node_modules/@jeswr')) {
        return true
      }
    }
  }), jsr, react()],
  build: {
    target: 'esnext'
  },
  resolve: {
    alias: {
      lodash: 'lodash-es',
      'npm:@iconify-icon/react@^3.0.0/dist/iconify.mjs': '@iconify-icon/react/dist/iconify.mjs'

    }
  }
})
