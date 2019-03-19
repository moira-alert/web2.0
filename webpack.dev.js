const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    output: {
        filename: "app.js",
        chunkFilename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    "classnames-loader",
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: "[name]-[local]-[hash:base64:6]",
                        },
                    },
                    "less-loader",
                ],
                include: path.resolve(__dirname, "src"),
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: "global",
                        },
                    },
                    "less-loader",
                ],
                include: /retail-ui/,
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
        ],
    },
    resolve: {
        alias: {
            "react-dom": "@hot-loader/react-dom",
        },
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devtool: "cheap-eval-source-map",
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
});
