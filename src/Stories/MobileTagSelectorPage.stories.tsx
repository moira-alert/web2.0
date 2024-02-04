import * as React from "react";
import { action } from "@storybook/addon-actions";
import MobileTagSelectorPage from "../Components/Mobile/MobileTagSelectorPage/MobileTagSelectorPage";

export default {
    title: "Mobile/TagSelectorPage",
};

export const Default = () => (
    <MobileTagSelectorPage
        availableTags={["hello", "world"]}
        selectedTags={[]}
        onlyProblems={false}
        onClose={action("onClose")}
        onChange={action("onChange")}
    />
);
