import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import StoryRouter from "storybook-react-router";
import MetricList from "../Components/MetricList/MetricList";
import { MetricItemList } from "../Domain/Metric";
import { Status } from "../Domain/Status";

const items: MetricItemList = {
    "vm-ditrace2.nginx.vm-ditrace2.nginx.*.vm-ditrace2.nginx.vm-ditrace3.elasticsearch.vm-ditrace3.ditrace": {
        event_timestamp: 1503484033,
        state: Status.NODATA,
        suppressed: false,
        value: 10.453,
        timestamp: 1503496225,
        maintenance: 1555804800,
        maintenance_info: {
            setup_user: "Superman",
            setup_time: 1553158221,
        },
    },
    "vm-ditrace3.ditrace": {
        event_timestamp: 1503486527,
        state: Status.WARN,
        suppressed: false,
        timestamp: 1503496225,
        maintenance: 1504100565,
    },
    "vm-ditrace3.elasticsearch": {
        event_timestamp: 1503486527,
        state: Status.ERROR,
        suppressed: false,
        timestamp: 1503496225,
        value: 109389189,
        maintenance: 1504118563,
        maintenance_info: {
            setup_user: null,
            setup_time: null,
        },
        values: {
            T1: 10938918,
            T2: 42069,
        },
    },
    "vm-ditrace3.nginx": {
        event_timestamp: 1503484033,
        state: Status.OK,
        suppressed: false,
        timestamp: 1503496225,
        maintenance_info: {
            setup_user: null,
            setup_time: null,
        },
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
            noDataMetricCount={5}
            sortingColumn="value"
            onChange={action("onChange")}
            onRemove={action("onRemove")}
            onNoDataRemove={action("onNoDataRemove")}
        />
    ));
