import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import StoryRouter from "storybook-react-router";
import MobileTriggerListPage from "../../Components/Mobile/MobileTriggerListPage/MobileTriggerListPage";
import data from "../Data/Triggers";

storiesOf("Mobile/TriggerListPage", module)
    .addDecorator(StoryRouter())
    .add("Default", () => (
        <MobileTriggerListPage
            triggers={data}
            pageCount={0}
            activePage={0}
            selectedTags={[]}
            onOpenTagSelector={action("onOpenTagSelector")}
            onChange={action("onChange")}
        />
    ))
    .add("Loading", () => (
        <MobileTriggerListPage
            triggers={null}
            selectedTags={[]}
            pageCount={0}
            activePage={0}
            loading
            onOpenTagSelector={action("onOpenTagSelector")}
            onChange={action("onChange")}
        />
    ));
