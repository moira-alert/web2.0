// @flow
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
            selectedTags={[]}
            onLoadMore={action("onLoadMore")}
            onOpenTagSelector={action("onOpenTagSelector")}
        />
    ))
    .add("Loading", () => (
        <MobileTriggerListPage
            triggers={null}
            selectedTags={[]}
            loading={true}
            onLoadMore={action("onLoadMore")}
            onOpenTagSelector={action("onOpenTagSelector")}
        />
    ));
