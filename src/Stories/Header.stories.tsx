import * as React from "react";
import { CSFStory } from "creevey";
import StoryRouter from "storybook-react-router";
import Header from "../Components/Header/Header";

export default { title: "Header" };

export const Default: CSFStory<JSX.Element> = () => <Header />;

Default.story = {
    decorators: [StoryRouter()],
    parameters: {
        creevey: {
            delay: 1000,
        },
    },
};
