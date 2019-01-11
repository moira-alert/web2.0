module.exports = {
    mode: "development",
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
                loader: "file-loader",
            },
        ],
    },
    resolve: {
        modules: ["node_modules", "web_modules", "local_modules"],
    },
};
