const { mergeWithCustomize, customizeObject } = require("webpack-merge");
const commonConfig = require("./webpack.config");

module.exports = mergeWithCustomize({
    customizeObject: customizeObject({ "devServer.proxy": "replace" }),
})(commonConfig, {
    devServer: {
        proxy: [{ context: ["/api"], target: "http://localhost:8080", secure: false }],
    },
});
