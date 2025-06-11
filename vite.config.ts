import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        mode !== "development" &&
            VitePWA({
                filename: "service-worker.js",
                manifest: false,
                workbox: {
                    navigateFallback: null,
                    navigateFallbackAllowlist: [/^(?!\/?(login|auth|oauth))/],
                    maximumFileSizeToCacheInBytes: 6291456,
                    cleanupOutdatedCaches: true,
                    skipWaiting: true,
                    clientsClaim: true,
                    sourcemap: false,
                    runtimeCaching: [
                        {
                            urlPattern: /^\/(?!api|oauth|auth|connect).*$/,
                            handler: "NetworkFirst",
                            options: {
                                cacheName: "html-pages",
                                expiration: {
                                    maxEntries: 8,
                                    maxAgeSeconds: 5 * 24 * 60 * 60,
                                },
                            },
                        },
                    ],
                },
            }),
    ].filter(Boolean),
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
