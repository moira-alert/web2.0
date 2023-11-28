import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Metric } from "../../Domain/Metric";
import { Status } from "../../Domain/Status";
import MobileMetricsListItem from "../../Components/Mobile/MobileMetricsListItem/MobileMetricsListItem";

const metricName =
    "vm-ditrace2.nginx.vm-ditrace2.nginx.*.vm-ditrace2.nginx.vm-ditrace3.elasticsearch.vm-ditrace3.ditrace";
const metricData: Metric = {
    event_timestamp: 1503484033,
    state: Status.OK,
    suppressed: false,
    timestamp: 1503496225,
    values: {
        t1: 109389189,
        t2: 110389189,
        t3: 111389189,
    },
};

storiesOf("Mobile/MetricsListItem", module)
    .add("With Status Indicator", () => (
        <MobileMetricsListItem
            name={metricName}
            value={metricData}
            onRemove={action("onRemove")}
            onSetMaintenance={action("onSetMaintenance")}
        />
    ))
    .add("With Targets", () => (
        <MobileMetricsListItem
            name={metricName}
            value={metricData}
            onRemove={action("onRemove")}
            onSetMaintenance={action("onSetMaintenance")}
            withTargets={true}
        />
    ));
