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
                target: "http://localhost:9002",
                onProxyReq: function (proxyReq) {
                    proxyReq.setHeader("X-WebAuth-User", process.env.WEB_AUTH_USER_HEADER);
                },
            },
        ],
    },
});
