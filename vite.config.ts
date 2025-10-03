import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@utilities': path.resolve(__dirname, 'src/utilities'),
            '@store': path.resolve(__dirname, 'src/store'),
            '@root': path.resolve(__dirname, 'src'),
        }
    }
})
