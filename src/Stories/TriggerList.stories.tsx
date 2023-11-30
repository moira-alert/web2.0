import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import StoryRouter from "storybook-react-router";
import { createMemoryHistory } from "history";
import TriggerList from "../Components/TriggerList/TriggerList";
import data from "./Data/Triggers";

const history = createMemoryHistory();
history.push = action("history.push");

storiesOf("TriggerList", module)
    .addDecorator(StoryRouter())
    .add("Default", () => (
        <TriggerList
            searchMode={false}
            items={data}
            onChange={action("onChange")}
            onRemove={action("onRemove")}
            history={history}
        />
    ))
    .add("Empty", () => (
        <TriggerList
            searchMode={false}
            items={[]}
            onChange={action("onChange")}
            onRemove={action("onRemove")}
            history={history}
        />
    ));
