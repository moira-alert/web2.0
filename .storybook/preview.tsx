import "reflect-metadata";
import "../src/style.less";
import { MemoryRouter } from "react-router";
import { Providers } from "../src/Providers/Providers";

export const decorators = [
    (Story) => {
        return (
            <MemoryRouter initialEntries={["/"]}>
                <Providers>
                    <Story />
                </Providers>
            </MemoryRouter>
        );
    },
];

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};
