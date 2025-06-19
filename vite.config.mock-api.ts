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
                        rewrite: (path) => path.replace(/^\/api/, ""),
                    },
                },
            },
        })
    )
);
