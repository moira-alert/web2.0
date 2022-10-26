import React from "react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import SubscriptionEditor from "../Components/SubscriptionEditor/SubscriptionEditor";
import { createSchedule, WholeWeek } from "../Domain/Schedule";

export default {
    title: "SubscriptionEditor",
    component: SubscriptionEditor,
    decorators: [
        (story: () => JSX.Element) => <ValidationContainer>{story()}</ValidationContainer>,
    ],
};

export const empty = () => (
    <SubscriptionEditor
        onChange={action("onChange")}
        tags={["tag1", "tag2"]}
        contacts={[
            {
                id: "1",
                type: "email",
                user: "1",
                value: "test@mail.ru",
            },
        ]}
        subscription={{
            sched: createSchedule(WholeWeek),
            tags: [],
            throttling: false,
            any_tags: false,
            contacts: [],
            enabled: true,
            ignore_recoverings: false,
            ignore_warnings: false,
            plotting: {
                enabled: true,
                theme: "light",
            },
        }}
    />
);

export const WithData = () => (
    <SubscriptionEditor
        onChange={action("onChange")}
        tags={["tag1", "tag2"]}
        contacts={[
            {
                id: "1",
                type: "email",
                user: "1",
                value: "test@mail.ru",
            },
        ]}
        subscription={{
            sched: createSchedule(WholeWeek),
            tags: ["tag1"],
            throttling: false,
            contacts: ["1"],
            enabled: true,
            any_tags: false,
            ignore_recoverings: false,
            ignore_warnings: false,
        }}
    />
);

export const WithDegradation = () => (
    <SubscriptionEditor
        onChange={action("onChange")}
        tags={["tag1", "tag2"]}
        contacts={[
            {
                id: "1",
                type: "email",
                user: "1",
                value: "test@mail.ru",
            },
        ]}
        subscription={{
            sched: createSchedule(WholeWeek),
            tags: ["tag1"],
            throttling: false,
            contacts: ["1"],
            enabled: true,
            ignore_recoverings: true,
            ignore_warnings: false,
            any_tags: false,
        }}
    />
);

export const WithoutGraph = () => (
    <SubscriptionEditor
        onChange={action("onChange")}
        tags={["tag1", "tag2"]}
        contacts={[
            {
                id: "1",
                type: "email",
                user: "1",
                value: "test@mail.ru",
            },
        ]}
        subscription={{
            sched: createSchedule(WholeWeek),
            tags: ["tag1"],
            throttling: false,
            contacts: ["1"],
            enabled: true,
            ignore_recoverings: false,
            ignore_warnings: false,
            any_tags: false,
            plotting: {
                enabled: false,
                theme: "dark",
            },
        }}
    />
);

export const WithGraphInDarkTheme = () => (
    <SubscriptionEditor
        onChange={action("onChange")}
        tags={["tag1", "tag2"]}
        contacts={[
            {
                id: "1",
                type: "email",
                user: "1",
                value: "test@mail.ru",
            },
        ]}
        subscription={{
            sched: createSchedule(WholeWeek),
            tags: ["tag1"],
            throttling: false,
            contacts: ["1"],
            enabled: true,
            ignore_recoverings: false,
            ignore_warnings: false,
            any_tags: false,
            plotting: {
                enabled: true,
                theme: "dark",
            },
        }}
    />
);

export const WithGraphInLightTheme = () => (
    <SubscriptionEditor
        onChange={action("onChange")}
        tags={["tag1", "tag2"]}
        contacts={[
            {
                id: "1",
                type: "email",
                user: "1",
                value: "test@mail.ru",
            },
        ]}
        subscription={{
            sched: createSchedule(WholeWeek),
            tags: ["tag1"],
            throttling: false,
            contacts: ["1"],
            enabled: true,
            ignore_recoverings: false,
            ignore_warnings: false,
            any_tags: false,
            plotting: {
                enabled: true,
                theme: "light",
            },
        }}
    />
);
