import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => {
    // Load environment variables
    const env = loadEnv(mode, process.cwd(), '');

    // [ĐÃ SỬA] Nếu không có biến môi trường, mặc định dùng '/' (căn gốc)
    const API_URL = env.VITE_APP_BASE_NAME || '/';
    
    const PORT = 3000;

    return {
        server: {
            open: true,
            port: PORT,
            host: true,
            // allowedHosts không cần thiết trên Vercel production nhưng giữ lại cũng không sao
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
            // Fix lỗi một số thư viện cũ dùng global
            global: 'window'
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@components': path.resolve(__dirname, './src/ui-component'),
                '@routes': path.resolve(__dirname, './src/routes'),
                '@themes': path.resolve(__dirname, './src/themes'),
                '@assets': path.resolve(__dirname, './src/assets'),
                // Fix lỗi icon tabler
                '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
            }
        },
        // [QUAN TRỌNG] base URL cho ứng dụng
        base: API_URL,
        plugins: [
            react(),
            jsconfigPaths()
        ]
    };
});