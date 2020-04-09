// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import StoryRouter from "storybook-react-router";
import MobileMetricsList from "../../Components/Mobile/MobileMetricsList/MobileMetricsList";

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

storiesOf("Mobile/MetricsList", module)
    .addDecorator(StoryRouter())
    .add("With Status Indicator", () => (
        <MobileMetricsList
            metrics={items}
            onRemove={action("onRemove")}
            onSetMaintenance={action("onSetMaintenance")}
        />
    ));
