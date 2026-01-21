import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(
                __dirname,
                './src/modules/shared/components',
            ),
            '@lib': path.resolve(__dirname, './src/modules/shared/lib'),
            '@lib/utils': path.resolve(
                __dirname,
                './src/modules/shared/lib/utils',
            ),
            '@hooks': path.resolve(__dirname, './src/modules/shared/hooks'),
        },
    },
});
