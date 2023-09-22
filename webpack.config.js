const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ContextReplacementPlugin = webpack.ContextReplacementPlugin;
const supportedLocales = ["en"];

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
        new MiniCssExtractPlugin({
            filename: "app.[contenthash:6].css",
            chunkFilename: "[name].[chunkhash:6].css",
        }),

        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: [/\.jsx?$/, /\.tsx?$/],
                use: ["babel-loader"],
                exclude: /node_modules/,
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
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                        },
                    },
                ],
            },
            {
                test: /\.less$/i,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                        },
                    },
                    ,
                    "less-loader",
                ],
            },
        ],
    },
    resolve: {
        modules: ["node_modules", "local_modules"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        alias: process.argv.includes("--mode=development")
            ? { "react-dom": "@hot-loader/react-dom" }
            : undefined,
    },
    devtool: "cheap-source-map",

    optimization: {
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
