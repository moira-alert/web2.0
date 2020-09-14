import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import MobileTagSelectorPage from "../Components/Mobile/MobileTagSelectorPage/MobileTagSelectorPage";

storiesOf("Mobile/TagSelectorPage", module).add("Default", () => (
    <MobileTagSelectorPage
        availableTags={["hello", "world"]}
        selectedTags={[]}
        onlyProblems={false}
        onClose={action("onClose")}
        onChange={action("onChange")}
    />
));
