// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import StoryRouter from "storybook-react-router";
import NotificationList from "../Components/NotificationList/NotificationList";

// item.timestamp + item.contact.id + item.event.sub_id;
const items = {
    "1505225036949654be-b364-4725-b2d2-e2b0ffbd058858661cb5-e6b2-4c8f-9a82-5e83673127d8": {
        event: {
            timestamp: 1505222055,
            metric: "KE.houston.daemons.error.errors.Focus_Production_Bingo_ElFeederMspIndex.1",
            value: 0,
            state: "OK",
            trigger_id: "f51bdab7-11ed-4ac4-9836-8a88b184cb67",
            sub_id: "58661cb5-e6b2-4c8f-9a82-5e83673127d8",
            old_state: "ERROR",
            msg: "",
        },
        trigger: {
            id: "f51bdab7-11ed-4ac4-9836-8a88b184cb67",
            name: "Declarant errors",
            desc: "",
            targets: ["KE.houston.daemons.error.*.*ElFeeder*.*"],
            warn_value: 1,
            error_value: 2,
            __notifier_trigger_tags: ["critical", "ElFeeders", "Focus"],
        },
        contact: {
            type: "telegram",
            value: "@skbkontur",
            id: "949654be-b364-4725-b2d2-e2b0ffbd0588",
            user: "a.tolstov",
        },
        throttled: true,
        send_fail: 12,
        timestamp: 1505225036,
    },
    "15052239865d7c1ee2-78d8-46c0-bb67-16895303b4b058661cb5-e6b2-4c8f-9a82-5e83673127d8": {
        event: {
            timestamp: 1505222055,
            metric: "KE.houston.daemons.error.errors.Focus_Production_Bingo_ElFeederMspIndex.1",
            value: 0,
            state: "OK",
            trigger_id: "f51bdab7-11ed-4ac4-9836-8a88b184cb67",
            sub_id: "58661cb5-e6b2-4c8f-9a82-5e83673127d8",
            old_state: "ERROR",
            msg: "",
        },
        trigger: {
            id: "f51bdab7-11ed-4ac4-9836-8a88b184cb67",
            name: "Focus Houston ElFeeders",
            desc: "",
            targets: ["KE.houston.daemons.error.*.*ElFeeder*.*"],
            warn_value: 1,
            error_value: 2,
            __notifier_trigger_tags: ["critical", "ElFeeders", "Focus"],
        },
        contact: {
            type: "mail",
            value: "user@skbkontur.ru",
            id: "5d7c1ee2-78d8-46c0-bb67-16895303b4b0",
            user: "a.tolstov",
        },
        throttled: false,
        send_fail: 0,
        timestamp: 1505223986,
    },
};

storiesOf("NotificationList", module)
    .addDecorator(StoryRouter())
    .add("Default", () => <NotificationList items={items} onRemove={action("onRemove")} />)
    .add("Empty", () => <NotificationList items={{}} onRemove={action("onRemove")} />);
