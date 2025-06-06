import * as React from "react";
import { action } from "@storybook/addon-actions";
import MobileTriggerListPage from "../../Components/Mobile/MobileTriggerListPage/MobileTriggerListPage";
import data from "../Data/Triggers";

export default {
    title: "Mobile/TriggerListPage",
};

export const Default = () => (
    <MobileTriggerListPage
        triggers={data}
        pageCount={0}
        activePage={0}
        selectedTags={[]}
        onOpenTagSelector={action("onOpenTagSelector")}
        onChange={action("onChange")}
    />
);

export const Loading = () => (
    <MobileTriggerListPage
        triggers={null}
        selectedTags={[]}
        pageCount={0}
        activePage={0}
        loading
        onOpenTagSelector={action("onOpenTagSelector")}
        onChange={action("onChange")}
    />
);
