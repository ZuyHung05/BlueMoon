import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path'; // ✅ Import Node's path module

export default defineConfig(({ mode }) => {
    // Load environment variables
    const env = loadEnv(mode, process.cwd(), '');

    // Base API URL and default port
    const API_URL = `${env.VITE_APP_BASE_NAME}`;
    const PORT = 3000;

    return {
        server: {
            open: true, // auto open browser
            port: PORT,
            host: true,
            allowedHosts: ['maurita-unpained-fearlessly.ngrok-free.dev']
        },
        build: {
            chunkSizeWarningLimit: 1600
        },
        preview: {
            open: true,
            host: true
        },
        define: {
            global: 'window'
        },
        resolve: {
            alias: {
                // ✅ Define main alias for "src"
                '@': path.resolve(__dirname, './src'),

                // ✅ You can also alias specific subfolders if desired:
                '@components': path.resolve(__dirname, './src/ui-component'),
                '@routes': path.resolve(__dirname, './src/routes'),
                '@themes': path.resolve(__dirname, './src/themes'),
                '@assets': path.resolve(__dirname, './src/assets'),
                '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
            }
        },
        base: API_URL,
        plugins: [
            react(),
            jsconfigPaths() // ✅ auto-resolve jsconfig/tsconfig paths
        ]
    };
});
