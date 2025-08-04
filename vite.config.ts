import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        VitePWA({
            devOptions: {
                enabled: false,
            },
            manifest: false,
            registerType: "autoUpdate",
            injectRegister: "auto",
            workbox: {
                skipWaiting: true,
                clientsClaim: true,
                sourcemap: false,
                maximumFileSizeToCacheInBytes: 6291456,
                navigateFallback: "/index.html",
                globPatterns: ["**/*.{js,css,woff2,svg,png,jpg,ico}"],
            },
        }),
    ],
    resolve: {
        alias: {
            "~styles": path.resolve(__dirname, "local_modules/styles"),
        },
    },
    css: {
        modules: {
            generateScopedName:
                mode === "development" ? "[path][name]__[local]" : "[hash:base64:6]",
        },
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                additionalData: `
                @import "~styles/variables.less";
                @import "~styles/mixins.module.less";
              `,
            },
        },
    },
    server: {
        port: 9000,
        open: true,
        host: "localhost",
    },
    build: {
        outDir: "dist",
        sourcemap: true,
    },
}));
