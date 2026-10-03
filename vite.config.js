import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 設定：掛上 React 外掛，讓 Vite 看得懂 .jsx
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // CSS 裡的 .nav-link，在 JSX 裡寫成 styles.navLink
      localsConvention: 'camelCaseOnly',
    },
  },
})
