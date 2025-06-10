import { mergeConfig, defineConfig } from "vite";
import mainConfig from "./vite.config";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig((configEnv) =>
    mergeConfig(
        mainConfig(configEnv),
        defineConfig({
            server: {
                proxy: {
                    "/api": {
                        target: "http://localhost:9002",
                        configure: (proxy) => {
                            proxy.on("proxyReq", (proxyReq) => {
                                if (process.env.WEB_AUTH_USER_HEADER) {
                                    proxyReq.setHeader(
                                        "X-WebAuth-User",
                                        process.env.WEB_AUTH_USER_HEADER
                                    );
                                }
                            });
                        },
                    },
                },
            },
        }),
        false
    )
);
