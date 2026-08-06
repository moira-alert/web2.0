import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

const brokenPackages = ["@emoji-mart/data"];

// Vite/rolldown merges the two conditional dynamic imports in app.tsx
// (import("./mobile.bundle") / import("./desktop.bundle")) into a single
// __vitePreload() call whose deps array only reflects one branch, so the CSS
// of the branch that's dropped never gets a <link> tag on production builds.
// This plugin walks the chunk graph itself for each named entry (same
// algorithm Vite uses internally: own importedCss + recurse into static
// imports) and exposes the correct per-entry CSS file lists at runtime, so
// app.tsx can inject the right <link> tags manually.
function injectEntryCssMap(entries: Record<string, string>): Plugin {
    return {
        name: "inject-entry-css-map",
        transformIndexHtml: {
            order: "post",
            handler(_html, ctx) {
                const bundle = ctx.bundle;
                if (!bundle) return;

                const cssByEntry: Record<string, string[]> = {};
                for (const [key, entryPath] of Object.entries(entries)) {
                    const entryChunk = Object.values(bundle).find(
                        (c) =>
                            c.type === "chunk" &&
                            c.facadeModuleId?.replace(/\\/g, "/").endsWith(entryPath)
                    );
                    if (!entryChunk || entryChunk.type !== "chunk") continue;

                    const seen = new Set<string>();
                    const css = new Set<string>();
                    const walk = (fileName: string) => {
                        if (seen.has(fileName)) return;
                        seen.add(fileName);
                        const chunk = bundle[fileName];
                        if (!chunk || chunk.type !== "chunk") return;
                        chunk.viteMetadata?.importedCss.forEach((f) => css.add(f));
                        chunk.imports.forEach(walk);
                    };
                    walk(entryChunk.fileName);
                    cssByEntry[key] = [...css];
                }

                return [
                    {
                        tag: "script",
                        children: `window.__ENTRY_CSS__=${JSON.stringify(cssByEntry)};`,
                        injectTo: "head",
                    },
                ];
            },
        },
    };
}

export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        injectEntryCssMap({
            mobile: "src/mobile.bundle.tsx",
            desktop: "src/desktop.bundle.tsx",
        }),
        VitePWA({
            devOptions: {
                enabled: false,
            },
            manifest: false,
            injectRegister: false,
            workbox: {
                skipWaiting: true,
                clientsClaim: true,
                sourcemap: false,
                maximumFileSizeToCacheInBytes: 6291456,
                navigateFallback: undefined,
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
        // cssCodeSplit: false,
    },
    optimizeDeps: {
        exclude: brokenPackages,
    },
}));
