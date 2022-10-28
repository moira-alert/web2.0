import "reflect-metadata";
import "../src/style.less";

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    creevey: {
        captureElement: "#root",
    },
};
