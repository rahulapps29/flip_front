import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4042, // or your preferred port
    allowedHosts: ['flipkart.algoapp.in'], // Add the allowed host here
  },
});
