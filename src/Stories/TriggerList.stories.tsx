import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import StoryRouter from "storybook-react-router";
import TriggerList from "../Components/TriggerList/TriggerList";
import data from "./Data/Triggers";

storiesOf("TriggerList", module)
    .addDecorator(StoryRouter())
    .add("Default", () => (
        <TriggerList
            searchMode={false}
            items={data}
            onChange={action("onChange")}
            onRemove={action("onRemove")}
        />
    ))
    .add("Empty", () => (
        <TriggerList
            searchMode={false}
            items={[]}
            onChange={action("onChange")}
            onRemove={action("onRemove")}
        />
    ));
