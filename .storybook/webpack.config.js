const path = require("path");

const config = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                loader: "babel-loader",
                include: /src|retail\-ui/,
                options: {
                    presets: ["@babel/env", "@babel/react"],
                },
            },
            {
                test: /\.less$/,
                loaders: [
                    "classnames-loader",
                    "style-loader",
                    "css-loader?modules&localIdentName=[name]-[local]-[hash:base64:5]",
                    "less-loader",
                ],
                include: /src/,
            },
            {
                test: /\.less$/,
                loaders: ["style-loader", "css-loader", "less-loader"],
                include: /retail\-ui/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|woff|woff2|eot|svg)$/,
                loader: "file-loader",
            },
        ],
    },
    resolve: {
        modules: ["node_modules", "web_modules", "local_modules"],
    },
    mode: "development",
};

module.exports = config;
