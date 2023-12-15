module.exports = {
    stories: ["../src/**/*.stories.mdx", "../src/Stories/**/*.stories.tsx"],
    framework: "@storybook/react",
    core: {
        builder: "@storybook/builder-webpack5",
    },
    babel: { presets: ["@babel/preset-react"] },
    webpackFinal: async (config, { configType }) => {
        config.module.rules = config.module.rules.filter(
            (rule) => rule.toString().test !== "/\\.css$/"
        );
        config.module.rules.push({
            test: /\.less$/i,
            use: [
                "style-loader",
                {
                    loader: "css-loader",
                    options: {
                        modules: true,
                    },
                },
                "less-loader",
            ],
        });

        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: require.resolve("ts-loader"),
        });

        config.resolve.extensions.push(".ts", ".tsx");
        config.resolve.modules = ["node_modules", "local_modules"];

        return config;
    },

    typescript: {
        reactDocgen: "react-docgen-typescript-plugin",
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
        },
    },
};
