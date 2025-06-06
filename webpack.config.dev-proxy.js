require("dotenv").config();

const { mergeWithCustomize, customizeObject } = require("webpack-merge");
const commonConfig = require("./webpack.config");

module.exports = mergeWithCustomize({
    customizeObject: customizeObject({ "devServer.proxy": "replace" }),
})(commonConfig, {
    devServer: {
        proxy: [
            {
                context: ["/api"],
                target: process.env.MOIRA_API_URL,
                auth: `${process.env.MOIRA_API_LOGIN}:${process.env.MOIRA_API_PASSWORD}`,
                secure: false,
                changeOrigin: true,
            },
        ],
    },
});
