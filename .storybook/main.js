module.exports = {
    stories: ['../src/Stories/**/*.stories.tsx'],
    addons: [
        "creevey",
    ],
    webpackFinal: async (config, { configType }) => {
        config.module.rules = config.module.rules.filter(rule => rule.test.toString() !== "/\\.css$/");

        config.module.rules.push({
            test: /\.(css|less)$/,
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
        });

        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: require.resolve('babel-loader'),
        });

        config.resolve.extensions.push(".ts", ".tsx");
        config.resolve.modules = ["node_modules", "local_modules"];

        return config;
    },
    typescript: {
        check: false,
        checkOptions: {},
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
        },
    },
};
