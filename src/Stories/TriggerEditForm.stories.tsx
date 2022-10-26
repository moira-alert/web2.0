import React from "react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { Status } from "../Domain/Status";
import { Trigger } from "../Domain/Trigger";
import { DaysOfWeek } from "../Domain/Schedule";

export default {
    title: "TriggerEditForm",
    components: TriggerEditForm,
    decorators: [
        (story: () => JSX.Element) => <ValidationContainer>{story()}</ValidationContainer>,
    ],
};

const sourceData: Trigger = {
    is_remote: false,
    id: "69b1-91c1-423f-ab3b-d1a8",
    name: "ELK. Low disk space",
    desc: "",
    targets: ["aliasByNode(DevOps.system.vm-elk*.disk.root.gigabyte_percentfree,2)"],
    warn_value: 20,
    error_value: 5,
    tags: ["devops", "critical"],
    ttl_state: Status.NODATA,
    ttl: 600,
    sched: {
        days: [
            { enabled: true, name: DaysOfWeek.Mon },
            { enabled: true, name: DaysOfWeek.Tue },
            { enabled: true, name: DaysOfWeek.Wed },
            { enabled: true, name: DaysOfWeek.Thu },
            { enabled: true, name: DaysOfWeek.Fri },
            { enabled: true, name: DaysOfWeek.Sat },
            { enabled: true, name: DaysOfWeek.Sun },
        ],
        tzOffset: -300,
        startOffset: 0,
        endOffset: 1439,
    },
    patterns: ["DevOps.system.vm-elk*.disk.root.gigabyte_percentfree"],
    trigger_type: "falling",
    throttling: 0,
    expression: "",
    notify_about_new_metrics: false,
    mute_new_metrics: false,
    alone_metrics: {},
};

const allTags = ["devops", "critical", "error", "warning", "del", "moira"];

export const Empty = () => (
    <TriggerEditForm
        data={{
            is_remote: false,
            name: "",
            desc: "",
            targets: [""],
            tags: [],
            patterns: [],
            expression: "",
            ttl: 600,
            ttl_state: Status.NODATA,
            sched: {
                startOffset: 0,
                endOffset: 1439,
                tzOffset: -300,
                days: [
                    { enabled: true, name: DaysOfWeek.Mon },
                    { enabled: true, name: DaysOfWeek.Tue },
                    { enabled: true, name: DaysOfWeek.Wed },
                    { enabled: true, name: DaysOfWeek.Thu },
                    { enabled: true, name: DaysOfWeek.Fri },
                    { enabled: true, name: DaysOfWeek.Sat },
                    { enabled: true, name: DaysOfWeek.Sun },
                ],
            },
            alone_metrics: {},
        }}
        tags={allTags}
        remoteAllowed={false}
        onChange={action("onChange")}
        validationResult={{
            targets: [{ syntax_ok: true }],
        }}
    />
);

export const Simple = () => (
    <TriggerEditForm
        data={{
            ...sourceData,
            targets: ["aliasByNode(DevOps.system.*ditrace*.process.*.uptime, 2, 4)"],
            sched: {
                startOffset: 613,
                endOffset: 1248,
                tzOffset: -300,
                days: [
                    { enabled: true, name: DaysOfWeek.Mon },
                    { enabled: true, name: DaysOfWeek.Tue },
                    { enabled: true, name: DaysOfWeek.Wed },
                    { enabled: true, name: DaysOfWeek.Thu },
                    { enabled: true, name: DaysOfWeek.Fri },
                    { enabled: true, name: DaysOfWeek.Sat },
                    { enabled: true, name: DaysOfWeek.Sun },
                ],
            },
        }}
        tags={allTags}
        remoteAllowed={false}
        onChange={action("onChange")}
        validationResult={{
            targets: [{ syntax_ok: true }],
        }}
    />
);

export const Advanced = () => (
    <TriggerEditForm
        data={{
            ...sourceData,
            trigger_type: "expression",
            expression:
                "t1 > 134500 ? ERROR : (PREV_STATE == OK ? (t1 > 5 : WARN ? OK) : (t1 > 6000000000 ? WARN : OK))",
            sched: {
                startOffset: 0,
                endOffset: 1439,
                tzOffset: -300,
                days: [
                    { enabled: true, name: DaysOfWeek.Mon },
                    { enabled: true, name: DaysOfWeek.Tue },
                    { enabled: false, name: DaysOfWeek.Wed },
                    { enabled: true, name: DaysOfWeek.Thu },
                    { enabled: true, name: DaysOfWeek.Fri },
                    { enabled: true, name: DaysOfWeek.Sat },
                    { enabled: false, name: DaysOfWeek.Sun },
                ],
            },
        }}
        tags={allTags}
        remoteAllowed={false}
        onChange={action("onChange")}
        validationResult={{
            targets: [{ syntax_ok: true }],
        }}
    />
);

export const FullFilled = () => (
    <TriggerEditForm
        data={{
            ...sourceData,
            desc: "Very usefull trigger",
            targets: [
                "aliasByNode(DevOps.system.*ditrace*.process.*.uptime, 2, 4)",
                "aliasByNode(DevOps.system.*ditrace*.process.*.uptime, 6, 8)",
            ],
            ttl_state: Status.OK,
            notify_about_new_metrics: true,
            alone_metrics: { t2: true },
        }}
        tags={allTags}
        remoteAllowed={false}
        onChange={action("onChange")}
        validationResult={{
            targets: [{ syntax_ok: true }],
        }}
    />
);
