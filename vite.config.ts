/// <reference types="vitest" />

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    test: {
        environment: 'jsdom',
        coverage: {
            exclude: [
                'src/main.ts',
                'src/types.ts',
                'src/vue.d.ts',
                'vite.config.ts',
                'node_modules/**',
                'dist/**'
            ]
        }
    },
    server: {
        port: 3000,
        open: true
    },
    build: {
        target: 'esnext',
        sourcemap: true
    }
})
