import React from "react";
import { MemoryRouter } from "react-router-dom";
import { action } from "@storybook/addon-actions";
import MobileTriggerInfoPage from "../../Components/Mobile/MobileTriggerInfoPage/MobileTriggerInfoPage";
import { Trigger, TriggerState } from "../../Domain/Trigger";
import { DaysOfWeek } from "../../Domain/Schedule";
import { Status } from "../../Domain/Status";

export default {
    title: "Mobile/MobileTriggerInfoPage",
    component: MobileTriggerInfoPage,
    decorators: [(story: () => JSX.Element) => <MemoryRouter>{story()}</MemoryRouter>],
    creevey: {
        skip: {
            stories: "Loading",
            reasons: "Loader animation",
        },
    },
};

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

export const Loading = () => (
    <MobileTriggerInfoPage
        data={null}
        triggerState={null}
        metrics={undefined}
        loading
        onRemoveMetric={action("onRemoveMetric")}
        onSetMetricMaintenance={action("onSetMetricMaintenance")}
        onSetTriggerMaintenance={action("onSetTriggerMaintenance")}
        onThrottlingRemove={action("onThrottlingRemove")}
    />
);

export const Default = () => (
    <MobileTriggerInfoPage
        triggerState={triggerState}
        data={sourceData}
        metrics={undefined}
        onRemoveMetric={action("onRemoveMetric")}
        onSetMetricMaintenance={action("onSetMetricMaintenance")}
        onSetTriggerMaintenance={action("onSetTriggerMaintenance")}
        onThrottlingRemove={action("onThrottlingRemove")}
    />
);

export const WithThrottling = () => (
    <MobileTriggerInfoPage
        triggerState={triggerState}
        data={{ ...sourceData, throttling: Date.now() }}
        metrics={undefined}
        onRemoveMetric={action("onRemoveMetric")}
        onSetMetricMaintenance={action("onSetMetricMaintenance")}
        onSetTriggerMaintenance={action("onSetTriggerMaintenance")}
        onThrottlingRemove={action("onThrottlingRemove")}
    />
);

export const NotEveryday = () => (
    <MobileTriggerInfoPage
        triggerState={triggerState}
        data={{
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
        }}
        metrics={undefined}
        onRemoveMetric={action("onRemoveMetric")}
        onSetMetricMaintenance={action("onSetMetricMaintenance")}
        onSetTriggerMaintenance={action("onSetTriggerMaintenance")}
        onThrottlingRemove={action("onThrottlingRemove")}
    />
);

export const WithError = () => (
    <MobileTriggerInfoPage
        triggerState={{
            ...triggerState,
            state: Status.EXCEPTION,
            msg: "Some error message message message message message.",
        }}
        data={{
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
        }}
        metrics={undefined}
        onRemoveMetric={action("onRemoveMetric")}
        onSetMetricMaintenance={action("onSetMetricMaintenance")}
        onSetTriggerMaintenance={action("onSetTriggerMaintenance")}
        onThrottlingRemove={action("onThrottlingRemove")}
    />
);
