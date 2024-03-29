import * as React from "react";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { SubscriptionListContainer } from "../Containers/SubscriptionListContainer/SubscriptionListContainer";
import { createSchedule, WholeWeek } from "../Domain/Schedule";
import actionWithDelay from "./StoryUtils";
import { Meta } from "@storybook/react";

const commonProps = {
    onAddSubscription: actionWithDelay("onAddSubscription", 2000),
    onRemoveSubscription: actionWithDelay("onRemoveSubscription", 2000),
    onUpdateSubscription: actionWithDelay("onUpdateSubscription", 2000),
    onTestSubscription: actionWithDelay("onTestSubscription", 2000),
};

const tags = ["tag1", "tag2"];

const contacts = [
    {
        id: "1",
        type: "phone",
        user: "1",
        value: "9876543210",
    },
    {
        id: "2",
        type: "email",
        user: "1",
        value: "test@mail.ru",
    },
];

const meta: Meta = {
    title: "SubscriptionList",
    decorators: [(story) => <ValidationContainer>{story()}</ValidationContainer>],
};

export const Defualt = () => (
    <SubscriptionListContainer
        {...commonProps}
        tags={tags}
        contacts={contacts}
        subscriptions={[
            {
                sched: createSchedule(WholeWeek),
                tags: ["1"],
                throttling: false,
                contacts: ["1"],
                enabled: true,
                user: "1",
                id: "1",
                ignore_recoverings: false,
                ignore_warnings: false,
            },
            {
                sched: createSchedule(WholeWeek),
                tags: ["1"],
                throttling: false,
                contacts: ["2"],
                enabled: true,
                user: "1",
                id: "2",
                ignore_recoverings: false,
                ignore_warnings: false,
            },
        ]}
    />
);

export const WithDisabledItem = () => (
    <SubscriptionListContainer
        {...commonProps}
        tags={tags}
        contacts={contacts}
        subscriptions={[
            {
                sched: createSchedule(WholeWeek),
                tags: ["1"],
                throttling: false,
                contacts: ["1"],
                enabled: true,
                user: "1",
                id: "1",
                ignore_recoverings: false,
                ignore_warnings: false,
            },
            {
                sched: createSchedule(WholeWeek),
                tags: ["1"],
                throttling: false,
                contacts: ["2"],
                enabled: false,
                user: "1",
                id: "2",
                ignore_recoverings: false,
                ignore_warnings: false,
            },
        ]}
    />
);

export const FewChannelsForSubscription = () => (
    <SubscriptionListContainer
        {...commonProps}
        tags={tags}
        contacts={contacts}
        subscriptions={[
            {
                sched: createSchedule(WholeWeek),
                tags: ["1"],
                throttling: false,
                contacts: ["1"],
                enabled: true,
                user: "1",
                id: "1",
                ignore_recoverings: false,
                ignore_warnings: false,
            },
            {
                sched: createSchedule(WholeWeek),
                tags: ["1"],
                throttling: false,
                contacts: ["1", "2"],
                enabled: false,
                user: "1",
                id: "2",
                ignore_recoverings: false,
                ignore_warnings: false,
            },
        ]}
    />
);

export const WithManyTags = () => (
    <SubscriptionListContainer
        {...commonProps}
        tags={tags}
        contacts={contacts}
        subscriptions={[
            {
                sched: createSchedule(WholeWeek),
                tags: ["1"],
                throttling: false,
                contacts: ["1"],
                enabled: false,
                user: "1",
                id: "1",
                ignore_recoverings: false,
                ignore_warnings: false,
            },
            {
                sched: createSchedule(WholeWeek),
                tags: [
                    "some-user:danger:warning",
                    "EDI",
                    "Octo",
                    "KeWeb",
                    "Moira",
                    "Focus",
                    "Pocus",
                    "SomeAnotherProduct",
                ],
                throttling: false,
                contacts: ["1"],
                enabled: true,
                user: "1",
                id: "2",
                ignore_recoverings: false,
                ignore_warnings: false,
            },
            {
                sched: createSchedule(WholeWeek),
                tags: ["1"],
                throttling: false,
                contacts: ["2"],
                enabled: false,
                user: "1",
                id: "3",
                ignore_recoverings: false,
                ignore_warnings: false,
            },
        ]}
    />
);

export default meta;
