import React from "react";
import { MemoryRouter } from "react-router-dom";
import { action } from "@storybook/addon-actions";
import MobileMetricsList from "../../Components/Mobile/MobileMetricsList/MobileMetricsList";
import { MetricItemList } from "../../Domain/Metric";
import { Status } from "../../Domain/Status";

export default {
    title: "Mobile/MetricsList",
    component: MobileMetricsList,
    decorators: [(story: () => JSX.Element) => <MemoryRouter>{story()}</MemoryRouter>],
};

const items: MetricItemList = {
    "vm-ditrace2.nginx.vm-ditrace2.nginx.*.vm-ditrace2.nginx.vm-ditrace3.elasticsearch.vm-ditrace3.ditrace": {
        event_timestamp: 1503484033,
        state: Status.NODATA,
        suppressed: false,
        value: 10.453,
        timestamp: 1503496225,
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
    },
    "vm-ditrace3.nginx": {
        event_timestamp: 1503484033,
        state: Status.OK,
        suppressed: false,
        timestamp: 1503496225,
    },
};

export const WithStatusIndicator = () => (
    <MobileMetricsList
        metrics={items}
        onRemove={action("onRemove")}
        onSetMaintenance={action("onSetMaintenance")}
    />
);
