import React from "react";
import { MemoryRouter } from "react-router-dom";
import { action } from "@storybook/addon-actions";
import MobileTriggerListPage from "../../Components/Mobile/MobileTriggerListPage/MobileTriggerListPage";
import data from "../Data/Triggers";

export default {
    title: "Mobile/TriggerListPage",
    component: MobileTriggerListPage,
    decorators: [(story: () => JSX.Element) => <MemoryRouter>{story()}</MemoryRouter>],
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
