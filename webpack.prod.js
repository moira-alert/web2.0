const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: "app.[hash:6].js",
    },
    module: {
        rules: [
            {
                test: /\.less$/,
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
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: "global",
                        },
                    },
                ],
            },
        ],
    },
    devtool: "cheap-source-map",
    plugins: [
        new MiniCssExtractPlugin({
            filename: "app.[hash:6].css",
        }),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
            },
        },
    },
});
