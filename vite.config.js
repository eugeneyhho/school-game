import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [vue()],
  // GitHub Pages serves this project at /school-game/, so the built assets
  // must be referenced from that sub-path. Local `npm run dev` keeps '/'.
  base: command === 'build' ? '/school-game/' : '/',
}))
