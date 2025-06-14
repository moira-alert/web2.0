const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ContextReplacementPlugin = webpack.ContextReplacementPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const { GenerateSW } = require("workbox-webpack-plugin");

const supportedLocales = ["en"];

const isDev = process.argv.includes("--mode=development");

module.exports = {
    entry: {
        app: path.resolve(__dirname, "src/index.ts"),
    },
    output: {
        filename: "app.[contenthash:6].js",
        chunkFilename: "[name].[chunkhash:6].js",
        publicPath: "/",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [
        !isDev &&
            new GenerateSW({
                //https://developer.chrome.com/docs/workbox/modules/workbox-webpack-plugin#type-GenerateSW
                // default maximum size is 3mb while our main chunk is 4mb
                // that's why size is sincreased to 6mb
                maximumFileSizeToCacheInBytes: 6291456,
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                sourcemap: false,
                skipWaiting: true,
                exclude: [/\*\.html$/, /.*oauth.*/, /\.map$/],
                runtimeCaching: [
                    {
                        urlPattern: ({ request }) =>
                            (request.mode === "navigate" ||
                                request.headers.get("accept")?.includes("text/html")) &&
                            !request.url.includes("oauth"),

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
            }),
        new ContextReplacementPlugin(
            /date-fns[\/\\]/,
            new RegExp(`[/\\\\\](${supportedLocales.join("|")})[/\\\\\]`)
        ),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            inject: "body",
            minify: {
                collapseWhitespace: true,
            },
        }),
        !isDev &&
            new MiniCssExtractPlugin({
                filename: "app.[contenthash:6].css",
                chunkFilename: "[name].[chunkhash:6].css",
            }),
    ],
    module: {
        rules: [
            {
                test: [/\.tsx?$/],
                use: ["ts-loader"],
                exclude: /node_modules|Stories/,
                include: [path.resolve(__dirname, "src")],
            },
            {
                test: /\.(png|woff|woff2|eot|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name]-[contenthash:6].[ext]",
                            outputPath: "assets",
                        },
                    },
                ],
            },
            {
                test: /\.less$|css$/i,
                use: [
                    isDev ? "style-loader" : MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: isDev ? "[path][name]__[local]" : "[contenthash:6]",
                            },
                        },
                    },
                    "less-loader",
                ],
            },
        ],
    },
    resolve: {
        modules: ["node_modules", "local_modules"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    devtool: "source-map",

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: { sourceMap: true },
            }),
        ],
        usedExports: true,
        splitChunks: {
            chunks: "all",
            minSize: 0,
            cacheGroups: {
                default: false,
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                },
                common: {
                    name: "common",
                    minChunks: 2,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    devServer: {
        open: true,
        hot: true,
        static: {
            directory: path.join(__dirname, "./"),
        },
        watchFiles: {
            // Prevents page reload when mutating json-server db.json
            options: {
                ignored: "**/db.json",
            },
        },
        port: 9000,
        historyApiFallback: true,
        proxy: {
            "/api": {
                target: "http://localhost:9002",
                pathRewrite: { "^/api": "" },
            },
        },
    },
};
