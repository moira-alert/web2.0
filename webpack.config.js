const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ContextReplacementPlugin = webpack.ContextReplacementPlugin;
const supportedLocales = ['en', 'ru', 'es-us']

module.exports = {
    entry: {
        app: path.resolve(__dirname, "src/index.js"),
    },
    output: {
        filename: "app.[hash:6].js",
        chunkFilename: "[name].[chunkhash:6].js",
        publicPath: "/",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.bundle\.jsx?$/,
                use: {
                    loader: "bundle-loader",
                    options: {
                        name: "[name]",
                        lazy: true,
                    },
                },
            },
            {
                test: /\.jsx?$/,
                use: ["babel-loader"],
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, "src"),
                ],
            },
            {
                test: /\.(png|woff|woff2|eot|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name]-[hash:6].[ext]",
                            outputPath: "assets",
                        },
                    },
                ],
            },
            {
                test: /\.(css|less)$/,
                use: [
                    "classnames-loader",
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                        },
                    },
                    "less-loader",
                ],
            },
        ],
    },
    resolve: {
        modules: ["node_modules", "local_modules"],
        extensions: [".js", ".jsx"],
        alias: process.argv.includes("--mode=development")
            ? {"react-dom": "@hot-loader/react-dom" }
            : undefined
    },
    devtool: "cheap-source-map",
    plugins: [
        new ContextReplacementPlugin(
            date\-fns[\/\\]/,
            new RegExp(`[/\\\\\](${supportedLocales.join('|')})[/\\\\\]`)
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
            filename: "app.[hash:6].css",
            chunkFilename: "[name].[chunkhash:6].css",
        }),

        new webpack.HotModuleReplacementPlugin()
    ],
    optimization: {
        usedExports: true,
        splitChunks: {
            chunks: "all",
            minSize: 0,
            cacheGroups: {
                default: false,
                vendors: {
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
        hot: true,
        contentBase: "./dist",
        port: 9000,
        historyApiFallback: true,
        proxy: {
            "/api":
                process.env.API_MODE === "local"
                    ? "" // Place you API url here. More options see on https://webpack.js.org/configuration/dev-server/#devserver-proxy
                    : {
                        target: "http://localhost:9002",
                        pathRewrite: { "^/api": "" },
                    },
        },
    },
};
