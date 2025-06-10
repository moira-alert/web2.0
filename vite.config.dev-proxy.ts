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
                        target: process.env.MOIRA_API_URL,
                        auth: `${process.env.MOIRA_API_LOGIN}:${process.env.MOIRA_API_PASSWORD}`,
                        secure: false,
                        changeOrigin: true,
                    },
                },
            },
        })
    )
);
