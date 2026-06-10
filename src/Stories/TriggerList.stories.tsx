import { action } from "storybook/actions";
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
