import * as React from "react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import SubscriptionEditor from "../Components/SubscriptionEditor/SubscriptionEditor";
import { createSchedule, WholeWeek } from "../Domain/Schedule";
import { Meta } from "@storybook/react";

const meta: Meta = {
    title: "SubscriptionEditor",
    decorators: [(story) => <ValidationContainer>{story()}</ValidationContainer>],
};

export const Empty = {
    render: () => (
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
    ),

    name: "empty",
};

export const WithData = {
    render: () => (
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
                plotting: {
                    enabled: false,
                    theme: "light",
                },
            }}
        />
    ),

    name: "with data",
};

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
            plotting: {
                enabled: false,
                theme: "light",
            },
        }}
    />
);

export const WithoutGraph = {
    render: () => (
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
    ),

    name: "Without graph",
};

export const WithGraphInDarkTheme = {
    render: () => (
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
    ),

    name: "With graph in dark theme",
};

export const WithGraphInLightTheme = {
    render: () => (
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
    ),

    name: "With graph in light theme",
};

export default meta;
