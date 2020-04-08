// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import Header from "../Components/Header/Header";

storiesOf("Header", module)
    .addParameters({
        creevey: {
            tests: {
                async Header() {
                    // Moira image get by url and loaded with a delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await this.expect(await this.takeScreenshot()).to.matchImage();
                },
            },
        },
    })
    .addDecorator(StoryRouter())
    .add("Default", () => <Header />);
