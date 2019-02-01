// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import StoryRouter from "storybook-react-router";
import MetricList from "../Components/MetricList/MetricList";

const items = {
    "vm-ditrace2.nginx.vm-ditrace2.nginx.*.vm-ditrace2.nginx.vm-ditrace3.elasticsearch.vm-ditrace3.ditrace": {
        event_timestamp: 1503484033,
        state: "NODATA",
        suppressed: false,
        value: 10.453,
        timestamp: 1503496225,
    },
    "vm-ditrace3.ditrace": {
        event_timestamp: 1503486527,
        state: "WARN",
        suppressed: false,
        timestamp: 1503496225,
        maintenance: 1504100565,
    },
    "vm-ditrace3.elasticsearch": {
        event_timestamp: 1503486527,
        state: "ERROR",
        suppressed: false,
        timestamp: 1503496225,
        value: 109389189,
        maintenance: 1504118563,
    },
    "vm-ditrace3.nginx": {
        event_timestamp: 1503484033,
        state: "OK",
        suppressed: false,
        timestamp: 1503496225,
    },
};

storiesOf("MetricList", module)
    .addDecorator(StoryRouter())
    .add("Default", () => (
        <MetricList
            items={items}
            sortingColumn="value"
            onChange={action("onChange")}
            onRemove={action("onRemove")}
        />
    ))
    .add("With Status Indicator", () => (
        <MetricList
            items={items}
            status
            sortingColumn="value"
            onChange={action("onChange")}
            onRemove={action("onRemove")}
        />
    ))
    .add("With Remove all NODATA", () => (
        <MetricList
            items={items}
            status
            noDataMerticCount={5}
            sortingColumn="value"
            onChange={action("onChange")}
            onRemove={action("onRemove")}
            onNoDataRemove={action("onNoDataRemove")}
        />
    ));
