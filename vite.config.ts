import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), createSvgIconsPlugin({
    // Specify the path to your icons folder
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    // Specify the symbol ID format
    symbolId: 'icon-[dir]-[name]',
  }),],
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
