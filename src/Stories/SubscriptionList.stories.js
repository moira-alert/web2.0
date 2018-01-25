// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { ValidationContainer } from "react-ui-validations";
import SubscriptionList from "../Components/SubscriptionList/SubscriptionList";
import { ContactTypes } from "../Domain/ContactType";
import { createSchedule, WholeWeek } from "../Domain/Schedule";
import { actionWithDelay } from "./StoryUtils";

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
        type: ContactTypes.pushover,
        user: "1",
        value: "u13XsadLKJjh273jafksaja7asjdkds ",
    },
    {
        id: "3",
        type: ContactTypes.pushover,
        user: "1",
        value: "u13XsadLKJjh273jafksaja7asjdkds ",
    },
    {
        id: "2",
        type: ContactTypes.mail,
        user: "1",
        value: "test@mail.ru",
    },
];

storiesOf("SubscriptionList", module)
    .addDecorator(story => <ValidationContainer>{story()}</ValidationContainer>)
    .add("Defualt", () => (
        <SubscriptionList
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
                    sendNotificationsOnTriggerDegradedOnly: undefined,
                    doNotSendWarnNotifications: undefined,
                },
                {
                    sched: createSchedule(WholeWeek),
                    tags: ["1"],
                    throttling: false,
                    contacts: ["1"],
                    enabled: true,
                    user: "1",
                    id: "2",
                    sendNotificationsOnTriggerDegradedOnly: undefined,
                    doNotSendWarnNotifications: undefined,
                },
            ]}
        />
    ))
    .add("WithDisabledItem", () => (
        <SubscriptionList
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
                    sendNotificationsOnTriggerDegradedOnly: undefined,
                    doNotSendWarnNotifications: undefined,
                },
                {
                    sched: createSchedule(WholeWeek),
                    tags: ["1"],
                    throttling: false,
                    contacts: ["1"],
                    enabled: false,
                    user: "1",
                    id: "2",
                    sendNotificationsOnTriggerDegradedOnly: undefined,
                    doNotSendWarnNotifications: undefined,
                },
            ]}
        />
    ))
    .add("FewChannelsForSubscription", () => (
        <SubscriptionList
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
                    sendNotificationsOnTriggerDegradedOnly: undefined,
                    doNotSendWarnNotifications: undefined,
                },
                {
                    sched: createSchedule(WholeWeek),
                    tags: ["1"],
                    throttling: false,
                    contacts: ["1", "3"],
                    enabled: false,
                    user: "1",
                    id: "2",
                    sendNotificationsOnTriggerDegradedOnly: undefined,
                    doNotSendWarnNotifications: undefined,
                },
            ]}
        />
    ))
    .add("WithManyTags", () => (
        <SubscriptionList
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
                    id: "2",
                    sendNotificationsOnTriggerDegradedOnly: undefined,
                    doNotSendWarnNotifications: undefined,
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
                    id: "1",
                    sendNotificationsOnTriggerDegradedOnly: undefined,
                    doNotSendWarnNotifications: undefined,
                },
                {
                    sched: createSchedule(WholeWeek),
                    tags: ["1"],
                    throttling: false,
                    contacts: ["1"],
                    enabled: false,
                    user: "1",
                    id: "2",
                    sendNotificationsOnTriggerDegradedOnly: undefined,
                    doNotSendWarnNotifications: undefined,
                },
            ]}
        />
    ));
