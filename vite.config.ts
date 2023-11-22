import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // ローカルネットワーク上の他のデバイスからアクセス可能にする
    port: 3000, // 好きなポート番号に設定（デフォルトは3000）
  },
  build: {
    chunkSizeWarningLimit: 1024, // チャンクサイズの警告限界を1024キロバイトに設定
  }
})
