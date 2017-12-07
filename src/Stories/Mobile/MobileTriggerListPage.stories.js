// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-router";
import MobileTriggerListPage from "../../Components/Mobile/MobileTriggerListPage/MobileTriggerListPage";
import MobileDecorator from "../Utils/MobileDecorator";
import data from "../Data/Triggers";

storiesOf("Mobile/TriggerListPage", module)
    .addDecorator(StoryRouter())
    .addDecorator(MobileDecorator)
    .add("Default", () => <MobileTriggerListPage triggers={data} selectedTags={null} loading={false} />)
    .add("Loading", () => <MobileTriggerListPage triggers={null} selectedTags={null} loading={true} />);
