const path = require("path");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
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
                    path.resolve(__dirname, "node_modules/retail-ui"),
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
        ],
    },
    resolve: {
        modules: ["node_modules", "local_modules"],
        extensions: [".js", ".jsx"],
    },
    plugins: [
        new MomentLocalesPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            favicon: "./src/favicon.ico",
            inject: "body",
            minify: {
                collapseWhitespace: true,
            },
        }),
    ],
    optimization: {
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
};
