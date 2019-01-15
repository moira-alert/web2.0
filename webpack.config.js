// @flow
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        app: ["@babel/polyfill", path.resolve(__dirname, "src/index.js")],
    },
    output: {
        publicPath: "/",
        path: path.resolve(__dirname, "dist"),
        filename: "app.js",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ["babel-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            plugins: ["@babel/plugin-proposal-object-rest-spread"],
                        },
                    },
                ],
                include: /retail-ui/,
            },
            {
                test: /\.less$/,
                use: [
                    "classnames-loader",
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                        },
                    },
                    "less-loader",
                ],
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: "global",
                        },
                    },
                ],
            },
            {
                test: /\.(png|woff|woff2|eot|svg)$/,
                use: "file-loader",
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
    devtool: "cheap-eval-source-map",
    devServer: {
        disableHostCheck: true,
        proxy: {
            "/api": {
                target: "http://localhost:9002",
                pathRewrite: { "^/api": "" },
            },
        },
    },
};
