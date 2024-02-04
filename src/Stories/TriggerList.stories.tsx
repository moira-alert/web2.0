import * as React from "react";
import { action } from "@storybook/addon-actions";
import { createMemoryHistory } from "history";
import TriggerList from "../Components/TriggerList/TriggerList";
import data from "./Data/Triggers";

const history = createMemoryHistory();
history.push = action("history.push");

export default {
    title: "TriggerList",
};

export const Default = () => (
    <TriggerList
        searchMode={false}
        items={data}
        onChange={action("onChange")}
        onRemove={action("onRemove")}
        history={history}
    />
);

export const Empty = () => (
    <TriggerList
        searchMode={false}
        items={[]}
        onChange={action("onChange")}
        onRemove={action("onRemove")}
        history={history}
    />
);
