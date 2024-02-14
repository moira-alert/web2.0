import * as React from "react";
import { action } from "@storybook/addon-actions";
import MobileTriggerListPage from "../../Components/Mobile/MobileTriggerListPage/MobileTriggerListPage";
import data from "../Data/Triggers";
import { History } from "history";

export default {
    title: "Mobile/TriggerListPage",
};

export const Default = (history: History) => (
    <MobileTriggerListPage
        triggers={data}
        pageCount={0}
        activePage={0}
        selectedTags={[]}
        history={history}
        onOpenTagSelector={action("onOpenTagSelector")}
        onChange={action("onChange")}
    />
);

export const Loading = (history: History) => (
    <MobileTriggerListPage
        triggers={null}
        selectedTags={[]}
        pageCount={0}
        activePage={0}
        history={history}
        loading
        onOpenTagSelector={action("onOpenTagSelector")}
        onChange={action("onChange")}
    />
);
