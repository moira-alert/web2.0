import * as React from "react";
import { action } from "@storybook/addon-actions";
import MetricList from "../Components/MetricList/MetricList";
import { MetricItemList } from "../Domain/Metric";
import { Status } from "../Domain/Status";

const items: MetricItemList = {
    "vm-ditrace2.nginx.vm-ditrace2.nginx.*.vm-ditrace2.nginx.vm-ditrace3.elasticsearch.vm-ditrace3.ditrace": {
        event_timestamp: 1503484033,
        state: Status.NODATA,
        suppressed: false,
        values: { T1: 10.453 },
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
        maintenance_info: {
            setup_user: "Superman",
            setup_time: 1553158221,
        },
    },
    "vm-ditrace3.elasticsearch": {
        event_timestamp: 1503486527,
        state: Status.ERROR,
        suppressed: false,
        timestamp: 1503496225,
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

export default {
    title: "MetricList",
};

export const Default = () => (
    <MetricList
        items={items}
        sortingColumn="value"
        onChange={action("onChange")}
        onRemove={action("onRemove")}
    />
);

export const WithStatusIndicator = () => (
    <MetricList
        items={items}
        status
        sortingColumn="value"
        onChange={action("onChange")}
        onRemove={action("onRemove")}
    />
);

export const WithRemoveAllNodata = {
    render: () => (
        <MetricList
            items={items}
            status
            noDataMetricCount={5}
            sortingColumn="value"
            onChange={action("onChange")}
            onRemove={action("onRemove")}
            onNoDataRemove={action("onNoDataRemove")}
        />
    ),

    name: "With Remove all NODATA",
};
