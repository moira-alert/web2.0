// `@babel/preset-env: modules: false` is leaves `import`, that don't work on nodejs

require("@babel/register")({
    babelrc: false,
    extensions: [".js", ".jsx"],
    presets: [
        "@babel/preset-flow",
        [
            "@babel/preset-env",
            {
                "targets": { "node": true }
            }
        ],
        "@babel/preset-react"
    ],
    plugins: [
        "react-hot-loader/babel",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-destructuring",
        "@babel/plugin-proposal-object-rest-spread"
    ],
});

require("creevey/lib/cli");
