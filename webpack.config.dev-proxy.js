require("dotenv").config();

const { mergeWithCustomize, customizeObject } = require("webpack-merge");
const commonConfig = require("./webpack.config");

module.exports = mergeWithCustomize({
    customizeObject: customizeObject({ "devServer.proxy": "replace" }),
})(commonConfig, {
    devServer: {
        proxy: {
            "/api": {
                target: "http://localhost:9002",
            },
        },
    },
});
