// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import StoryRouter from "storybook-router";
import PatternList from "../Components/PatternList/PatternList";

const items = [
    {
        metrics: ["KE.system.busc.vm-busc1.cpu.usage", "KE.system.busc.vm-busc2.cpu.usage"],
        pattern: "pattern.with.triggers.and.metrics",
        triggers: [
            {
                id: "e872a927-e6d2-4b2e-b1fb-63d2345357f2",
                name: "KE_SYSTEM_CPU",
                targets: ["KE.system.busc.*.cpu.usage"],
                warn_value: 80,
                error_value: 90,
                tags: ["KE-Test.System"],
                ttl_state: "NODATA",
                throttling: 1,
                is_simple_trigger: true,
                expression: "",
                ttl: 600,
                sched: {
                    days: [
                        { enabled: true, name: "Mon" },
                        { enabled: true, name: "Tue" },
                        { enabled: true, name: "Wed" },
                        { enabled: true, name: "Thu" },
                        { enabled: true, name: "Fri" },
                        { enabled: true, name: "Sat" },
                        { enabled: true, name: "Sun" },
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
                id: "f08977e6-bfcd-4ca4-8e4a-5b3ffc56284b",
                name: "focus351 Elasticsearch cluster status",
                desc: "",
                targets: [
                    "alias(movingMax(minSeries(focus.elasticsearch.focus351.*.cluster_health.status ), '10min' ), 'cluster_health' )",
                ],
                warn_value: 1,
                error_value: 0,
                tags: ["Elasticsearch", "Focus", "DevOps"],
                ttl_state: "NODATA",
                throttling: 1,
                is_simple_trigger: true,
                expression: "",
                ttl: 600,
                sched: {
                    days: [
                        { enabled: true, name: "Mon" },
                        { enabled: true, name: "Tue" },
                        { enabled: true, name: "Wed" },
                        { enabled: true, name: "Thu" },
                        { enabled: true, name: "Fri" },
                        { enabled: true, name: "Sat" },
                        { enabled: true, name: "Sun" },
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

storiesOf("PatternList", module)
    .addDecorator(StoryRouter())
    .add("Default", () => <PatternList items={items} onRemove={action("onRemove")} />);
