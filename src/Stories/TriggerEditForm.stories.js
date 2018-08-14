// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import StoryRouter from "storybook-router";
import { Statuses } from "../Domain/Status";
import { ValidationContainer } from "react-ui-validations";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";

const sourceData = {
    is_remote: false,
    id: "69b1-91c1-423f-ab3b-d1a8",
    name: "ELK. Low disk space",
    desc: "",
    targets: ["aliasByNode(DevOps.system.vm-elk*.disk.root.gigabyte_percentfree,2)"],
    warn_value: 20,
    error_value: 5,
    tags: ["devops", "critical"],
    ttl_state: "NODATA",
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
    patterns: ["DevOps.system.vm-elk*.disk.root.gigabyte_percentfree"],
    is_simple_trigger: true,
    throttling: 0,
    expression: "",
};

const allTags = ["devops", "critical", "error", "warning", "del", "moira"];

const stories = [
    {
        title: "Empty",
        data: {
            is_remote: false,
            name: "",
            desc: "",
            targets: [""],
            tags: [],
            patterns: [],
            expression: "",
            ttl: 600,
            ttl_state: Statuses.NODATA,
            sched: {
                startOffset: 0,
                endOffset: 1439,
                tzOffset: -300,
                days: [
                    { name: "Mon", enabled: true },
                    { name: "Tue", enabled: true },
                    { name: "Wed", enabled: true },
                    { name: "Thu", enabled: true },
                    { name: "Fri", enabled: true },
                    { name: "Sat", enabled: true },
                    { name: "Sun", enabled: true },
                ],
            },
        },
    },
    {
        title: "Simple",
        data: {
            ...sourceData,
            targets: ["aliasByNode(DevOps.system.*ditrace*.process.*.uptime, 2, 4)"],
            sched: {
                startOffset: 613,
                endOffset: 1248,
                tzOffset: -300,
                days: [
                    { name: "Mon", enabled: true },
                    { name: "Tue", enabled: true },
                    { name: "Wed", enabled: true },
                    { name: "Thu", enabled: true },
                    { name: "Fri", enabled: true },
                    { name: "Sat", enabled: true },
                    { name: "Sun", enabled: true },
                ],
            },
        },
    },
    {
        title: "Advanced",
        data: {
            ...sourceData,
            is_simple_trigger: false,
            expression:
                "t1 > 134500 ? ERROR : (PREV_STATE == OK ? (t1 > 5 : WARN ? OK) : (t1 > 6000000000 ? WARN : OK))",
            sched: {
                startOffset: 0,
                endOffset: 1439,
                tzOffset: -300,
                days: [
                    { name: "Mon", enabled: true },
                    { name: "Tue", enabled: true },
                    { name: "Wed", enabled: false },
                    { name: "Thu", enabled: true },
                    { name: "Fri", enabled: true },
                    { name: "Sat", enabled: true },
                    { name: "Sun", enabled: false },
                ],
            },
        },
    },
    {
        title: "Full filled",
        data: {
            ...sourceData,
            desc: "Very usefull trigger",
            targets: [
                "aliasByNode(DevOps.system.*ditrace*.process.*.uptime, 2, 4)",
                "aliasByNode(DevOps.system.*ditrace*.process.*.uptime, 6, 8)",
            ],
            ttl_state: Statuses.OK,
        },
    },
];

const story = storiesOf("TriggerEditForm", module).addDecorator(StoryRouter());

stories.forEach(({ title, data }) => {
    story.add(title, () => (
        <ValidationContainer>
            <TriggerEditForm data={data} tags={allTags} remoteAllowed={data.is_remote} onChange={action("onChange")} />
        </ValidationContainer>
    ));
});
