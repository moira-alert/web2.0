import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import StoryRouter from "storybook-react-router";
import TriggerInfo from "../Components/TriggerInfo/TriggerInfo";
import { DaysOfWeek } from "../Domain/Schedule";
import { Trigger, TriggerState } from "../Domain/Trigger";
import { Status } from "../Domain/Status";
import { createMemoryHistory } from "history";

const history = createMemoryHistory();
history.push = action("history.push");

const sourceData: Trigger = {
    mute_new_metrics: false,
    notify_about_new_metrics: false,
    is_remote: false,
    error_value: 1000.0,
    sched: {
        endOffset: 1439,
        days: [
            { enabled: true, name: DaysOfWeek.Mon },
            { enabled: true, name: DaysOfWeek.Tue },
            { enabled: true, name: DaysOfWeek.Wed },
            { enabled: true, name: DaysOfWeek.Thu },
            { enabled: true, name: DaysOfWeek.Fri },
            { enabled: true, name: DaysOfWeek.Sat },
            { enabled: true, name: DaysOfWeek.Sun },
        ],
        startOffset: 0,
        tzOffset: -300,
    },
    name: "KE_SYSTEM_KAMCHATKA_HDD",
    tags: ["KE.System-kamchatka"],
    throttling: 0,
    ttl_state: Status.NODATA,
    id: "e8304401-718e-4a73-8d13-e9abe4c91d69",
    patterns: ["KE.system-kamchatka.allServers.*.volumes.c.freemegabytes"],
    trigger_type: "falling",
    ttl: 600,
    warn_value: 5000.0,
    expression: "",
    targets: ["KE.system-kamchatka.allServers.*.volumes.c.freemegabytes"],
    desc:
        "\u041c\u0435\u0441\u0442\u043e \u043d\u0430 \u0434\u0438\u0441\u043a\u0430\u0445 \u043d\u0430 \u041a\u0430\u043c\u0447\u0430\u0442\u0441\u043a\u043e\u0439 \u043f\u043b\u043e\u0449\u0430\u0434\u043a\u0435.",
};

const triggerState: TriggerState = {
    maintenance: undefined,
    metrics: {
        About: {
            event_timestamp: 1512204450,
            state: Status.NODATA,
            suppressed: false,
            timestamp: 1512206430,
        },
    },
    score: 75000,
    state: Status.OK,
    timestamp: 1512207091,
    trigger_id: "e8304401-718e-4a73-8d13-e9abe4c91d69",
};

const stories: Array<{
    title: string;
    triggerState: TriggerState;
    data: Trigger;
}> = [
    {
        title: "Default",
        triggerState: { ...triggerState },
        data: { ...sourceData },
    },
    {
        title: "Description in multiple line",
        triggerState: { ...triggerState },
        data: { ...sourceData, desc: "Some list:\n- Line 1\n- Line 2\n- Line 3" },
    },
    {
        title: "With throttling",
        triggerState: { ...triggerState },
        data: { ...sourceData, throttling: Date.now() },
    },
    {
        title: "Not everyday",
        triggerState: { ...triggerState },
        data: {
            ...sourceData,
            sched: {
                endOffset: 1439,
                days: [
                    { enabled: true, name: DaysOfWeek.Mon },
                    { enabled: false, name: DaysOfWeek.Tue },
                    { enabled: true, name: DaysOfWeek.Wed },
                    { enabled: true, name: DaysOfWeek.Thu },
                    { enabled: true, name: DaysOfWeek.Fri },
                    { enabled: false, name: DaysOfWeek.Sat },
                    { enabled: true, name: DaysOfWeek.Sun },
                ],
                startOffset: 0,
                tzOffset: -300,
            },
        },
    },
    {
        title: "WithError",
        triggerState: {
            ...triggerState,
            state: Status.EXCEPTION,
            msg: "Some error message message message message message.",
        },
        data: {
            ...sourceData,
            sched: {
                endOffset: 1439,
                days: [
                    { enabled: true, name: DaysOfWeek.Mon },
                    { enabled: false, name: DaysOfWeek.Tue },
                    { enabled: true, name: DaysOfWeek.Wed },
                    { enabled: true, name: DaysOfWeek.Thu },
                    { enabled: true, name: DaysOfWeek.Fri },
                    { enabled: false, name: DaysOfWeek.Sat },
                    { enabled: true, name: DaysOfWeek.Sun },
                ],
                startOffset: 0,
                tzOffset: -300,
            },
        },
    },
    {
        title: "With maintenance",
        triggerState: { ...triggerState, maintenance: Date.now() / 1000 + 3600 },
        data: { ...sourceData },
    },
    {
        title: "With maintenance and maintenance info",
        triggerState: {
            ...triggerState,
            maintenance: Date.now() / 1000 + 3600,
            maintenanceInfo: {
                setup_user: "Batman",
                setup_time: 1553158221,
            },
        },
        data: { ...sourceData },
    },
];

const story = storiesOf("TriggerInfo", module).addDecorator(StoryRouter());

stories.forEach(({ title, data, triggerState: state }) => {
    story.add(title, () => (
        <TriggerInfo
            supportEmail="support@mail.ru"
            triggerState={state}
            data={data}
            onThrottlingRemove={action("onThrottlingRemove")}
            onSetMaintenance={action("onSetMaintenance")}
            history={history}
        />
    ));
});
