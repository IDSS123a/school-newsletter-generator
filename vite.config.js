import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig(function (_a) {
    var command = _a.command;
    var config = {
        plugins: [react()],
        base: '/',
        define: {
            // Passes the API key from the build environment to the application code
            'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY)
        }
    };
    if (command !== 'serve') {
        // IMPORTANT: REPLACE 'your-repo-name' WITH THE ACTUAL NAME OF YOUR GITHUB REPOSITORY
        // For example, if your repo URL is https://github.com/user/my-app,
        // the base should be '/my-app/'
        config.base = '/school-newsletter-generator/';
    }
    return config;
});
