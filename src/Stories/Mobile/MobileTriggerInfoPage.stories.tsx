import * as React from "react";
import { action } from "@storybook/addon-actions";
import MobileTriggerInfoPage from "../../Components/Mobile/MobileTriggerInfoPage/MobileTriggerInfoPage";
import { Trigger, TriggerSource, TriggerState } from "../../Domain/Trigger";
import { DaysOfWeek } from "../../Domain/Schedule";
import { Status } from "../../Domain/Status";

const sourceData: Trigger = {
    mute_new_metrics: false,
    notify_about_new_metrics: false,
    trigger_source: TriggerSource.GRAPHITE_LOCAL,
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
    is_remote: false,
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

export default { title: "Mobile/TriggerInfoPage" };

const commonProps = {
    metrics: undefined,
    onRemoveMetric: action("onRemoveMetric"),
    onSetMetricMaintenance: action("onSetMetricMaintenance"),
    onSetTriggerMaintenance: action("onSetTriggerMaintenance"),
    onThrottlingRemove: action("onThrottlingRemove"),
};

export const Loading = () => (
    <MobileTriggerInfoPage {...commonProps} data={null} triggerState={null} />
);

export const Default = () => (
    <MobileTriggerInfoPage {...commonProps} triggerState={{ ...triggerState }} data={sourceData} />
);

export const WithThrottling = () => (
    <MobileTriggerInfoPage
        {...commonProps}
        triggerState={{ ...triggerState }}
        data={{ ...sourceData, throttling: Date.now() }}
    />
);

export const NotEveryday = () => (
    <MobileTriggerInfoPage
        {...commonProps}
        triggerState={{ ...triggerState }}
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
    />
);

export const WithError = () => (
    <MobileTriggerInfoPage
        {...commonProps}
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
    />
);
