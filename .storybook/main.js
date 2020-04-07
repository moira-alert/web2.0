module.exports = {
    stories: ['../src/Stories/**/*.stories.js'],
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

        config.resolve.modules = ["node_modules", "local_modules"];

        return config;
    },
};
