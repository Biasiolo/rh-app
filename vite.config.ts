import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    // Não é necessário importar o plugin 'tailwindcss' diretamente
    // O Vite lida com isso ao compilar automaticamente a partir do arquivo CSS
  ],
  
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, './src/components')
      },
      {
        find: '@hooks',
        replacement: path.resolve(__dirname, './src/hooks')
      }
    ]
  },

  // Adicione as configurações de CSS
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js') // caso tenha um arquivo de configuração customizado
  }
})
