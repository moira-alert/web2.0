import * as React from "react";
import { action } from "@storybook/addon-actions";
import TriggerList from "../Components/TriggerList/TriggerList";
import data from "./Data/Triggers";

export default {
    title: "TriggerList",
};

export const Default = () => (
    <TriggerList
        searchMode={false}
        items={data}
        onChange={action("onChange")}
        onRemove={action("onRemove")}
    />
);

export const Empty = () => (
    <TriggerList
        searchMode={false}
        items={[]}
        onChange={action("onChange")}
        onRemove={action("onRemove")}
    />
);
