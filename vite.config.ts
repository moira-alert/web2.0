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
            scope: "/assets",
            manifest: false,
            injectRegister: false,
            workbox: {
                skipWaiting: true,
                clientsClaim: true,
                sourcemap: false,
                maximumFileSizeToCacheInBytes: 6291456,
                navigateFallback: undefined,
                globPatterns: ["**/*.{js,css,woff2,svg,png,jpg}"],
                // runtimeCaching: [
                //     {
                //         urlPattern: /\.(js|css|woff2?|png|jpe?g|svg)$/,
                //         handler: "CacheFirst",
                //         options: {
                //             cacheName: "static-assets",
                //             expiration: {
                //                 maxEntries: 15,
                //                 maxAgeSeconds: 5 * 24 * 60 * 60,
                //             },
                //         },
                //     },
                // ],
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
