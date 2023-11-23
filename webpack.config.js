const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ContextReplacementPlugin = webpack.ContextReplacementPlugin;
const TerserPlugin = require("terser-webpack-plugin");
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
        new ContextReplacementPlugin(
            /date-fns[\/\\]/,
            new RegExp(`[/\\\\\](${supportedLocales.join("|")})[/\\\\\]`)
        ),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            favicon: "./src/favicon.ico",
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
        alias: isDev ? { "react-dom": "@hot-loader/react-dom" } : undefined,
    },
    devtool: "source-map",

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({ parallel: true, terserOptions: { sourceMap: true } })],
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
