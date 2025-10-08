import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/',
  }

  if (command !== 'serve') {
    // OVDJE UNESITE IME VAŠEG REPOZITORIJA IZ FAZE 1
    // npr. ako se repozitorij zove 'moj-newsletter', linija treba da glasi:
    // config.base = '/moj-newsletter/'
    config.base = '/school-newsletter-generator/' // <--- ISPRAVITE OVO!
  }

  return config
})
