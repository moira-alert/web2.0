const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = argv => {
    const PROD = process.env.NODE_ENV === "production";
    const API_MODE = getApiMode(argv);
    const config = {
        entry: {
            app: ["@babel/polyfill", "react-hot-loader/patch", "./src/index.js"],
        },
        output: {
            publicPath: "/",
            path: path.resolve(__dirname, "dist"),
            filename: PROD ? "app.[hash].js" : "app.js",
            chunkFilename: PROD ? "app.[id].[hash].js" : "app.[id].js",
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: ["babel-loader"],
                    exclude: /node_modules/,
                },
                {
                    test: /\.AppRoot\.js$/,
                    use: [
                        {
                            loader: "bundle-loader",
                            options: {
                                lazy: true,
                            },
                        },
                        "babel-loader",
                    ],
                    include: path.join(__dirname, "src"),
                },
                {
                    test: /\.jsx?$/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: ["@babel/env", "@babel/react"],
                                plugins: [
                                    "@babel/plugin-proposal-object-rest-spread",
                                    "@babel/plugin-proposal-class-properties",
                                ],
                            },
                        },
                    ],
                    include: /retail-ui/,
                },
                {
                    test: /\.less$/,
                    rules: [
                        { use: "classnames-loader" },
                        {
                            use: [
                                "style-loader",
                                {
                                    loader: "css-loader",
                                    options: {
                                        modules: true,
                                        localIdentName: "[name]-[local]-[hash:base64:5]",
                                    },
                                },
                                "less-loader",
                            ],
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
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
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        ],
        devServer: {
            disableHostCheck: true,
            proxy:
                API_MODE === "local"
                    ? {
                          "/api": "", // Place you API url here. More options see on https://webpack.js.org/configuration/dev-server/#devserver-proxy
                      }
                    : {
                          "/api": {
                              target: "http://localhost:9002",
                              pathRewrite: { "^/api": "" },
                          },
                      },
        },
    };
    return config;
};

function getApiMode(argv) {
    for (const arg of argv) {
        if (arg.startsWith("--env.API=")) {
            return arg.substr("--env.API=".length);
        }
    }
    return "fake";
}

module.exports = config(process.argv);
