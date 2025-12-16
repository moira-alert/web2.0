module.exports = {
    stories: ["../src/Stories/**/*.stories.tsx"],
    framework: {
        name: "@storybook/react-vite",
    },
    babel: { presets: ["@babel/preset-react"] },

    typescript: {
        reactDocgen: "react-docgen-typescript-plugin",
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
        },
    },
};
