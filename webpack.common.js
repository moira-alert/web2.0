// @flow
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        app: ["@babel/polyfill", path.resolve(__dirname, "src/index.js")],
    },
    output: {
        publicPath: "/",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.AppRoot\.jsx?$/,
                use: [
                    {
                        loader: "bundle-loader",
                        options: {
                            lazy: true,
                        },
                    },
                    "babel-loader",
                ],
                include: path.resolve(__dirname, "src"),
            },
            {
                test: /\.jsx?$/,
                use: ["babel-loader"],
                exclude: /node_modules/,
                include: [path.resolve(__dirname, "src"), path.resolve(__dirname, "node_modules/retail-ui")],
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
        ],
    },
    resolve: {
        modules: ["node_modules", "local_modules"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            favicon: "./src/favicon.ico",
            inject: "body",
            minify: {
                collapseWhitespace: true,
            },
        }),
    ],
};
