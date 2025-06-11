import { mergeConfig, defineConfig } from "vite";
import mainConfig from "./vite.config";

export default defineConfig((configEnv) =>
    mergeConfig(
        mainConfig(configEnv),
        defineConfig({
            server: {
                proxy: {
                    "/api": { target: "http://localhost:8080", secure: false },
                },
            },
        })
    )
);
