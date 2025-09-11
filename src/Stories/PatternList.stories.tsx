import * as React from "react";
import { action } from "@storybook/addon-actions";
import PatternList from "../Components/PatternList/PatternList";
import { Pattern } from "../Domain/Pattern";
import { DaysOfWeek } from "../Domain/Schedule";
import { Status } from "../Domain/Status";
import { TriggerSource } from "../Domain/Trigger";

const items: Pattern[] = [
    {
        metrics: ["KE.system.busc.vm-busc1.cpu.usage", "KE.system.busc.vm-busc2.cpu.usage"],
        pattern: "pattern.with.triggers.and.metrics",
        triggers: [
            {
                mute_new_metrics: false,
                trigger_source: TriggerSource.GRAPHITE_LOCAL,
                id: "e872a927-e6d2-4b2e-b1fb-63d2345357f2",
                name: "KE_SYSTEM_CPU",
                targets: ["KE.system.busc.*.cpu.usage"],
                warn_value: 80,
                error_value: 90,
                tags: ["KE-Test.System"],
                ttl_state: Status.NODATA,
                trigger_type: "rising",
                expression: "",
                ttl: 600,
                is_remote: false,
                alone_metrics: {},
                cluster_id: "default",
                created_by: "moira_team",
                updated_by: "moira_team",
                created_at: "2025-09-10T09:01:11Z",
                updated_at: "2025-09-10T09:01:11Z",
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
                patterns: ["KE.system.busc.*.cpu.usage"],
            },
        ],
    },
    {
        metrics: [],
        pattern: "pattern.with.triggers.and.without.metrics",
        triggers: [
            {
                mute_new_metrics: false,
                trigger_source: TriggerSource.GRAPHITE_LOCAL,
                id: "f08977e6-bfcd-4ca4-8e4a-5b3ffc56284b",
                name: "focus351 Elasticsearch cluster status",
                desc: "",
                targets: [
                    "alias(movingMax(minSeries(focus.elasticsearch.focus351.*.cluster_health.status ), '10min' ), 'cluster_health' )",
                ],
                warn_value: 1,
                error_value: 0,
                is_remote: false,
                tags: ["Elasticsearch", "Focus", "DevOps"],
                ttl_state: Status.NODATA,
                trigger_type: "falling",
                expression: "",
                ttl: 600,
                alone_metrics: {},
                cluster_id: "default",
                created_by: "moira_team",
                updated_by: "moira_team",
                created_at: "2025-09-10T09:01:11Z",
                updated_at: "2025-09-10T09:01:11Z",
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
                patterns: ["focus.elasticsearch.focus351.*.cluster_health.status"],
            },
        ],
    },
    {
        metrics: [
            "DevOps.elasticsearch.vm-elk-s1.hot.jvm.gc.collection.time",
            "DevOps.elasticsearch.vm-elk-s2.master.jvm.gc.collection.time",
            "DevOps.elasticsearch.vm-elk-s2.hot.jvm.gc.collection.time",
            "DevOps.elasticsearch.vm-elk-s3.hot.jvm.gc.collection.time",
            "DevOps.elasticsearch.vm-elk-s3.master.jvm.gc.collection.time",
            "DevOps.elasticsearch.vm-elk-s1.master.jvm.gc.collection.time",
        ],
        pattern: "pattern.without.triggers.and.with.metrics",
        triggers: [],
    },
    {
        metrics: [],
        pattern: "pattern.without.triggers.and.metrics",
        triggers: [],
    },
];

export default {
    title: "PatternList",
};

export const Default = () => (
    <PatternList
        items={items}
        onRemove={action("onRemove")}
        sortConfig={{ direction: "asc", sortingColumn: "metrics" }}
    />
);
