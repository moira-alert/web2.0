import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Status, StatusesList } from "../Domain/Status";
import StatusIndicator from "../Components/StatusIndicator/StatusIndicator";

storiesOf("StatusIndicator", module)
    .add("All single color variants", () => (
        <div style={{ display: "flex" }}>
            {StatusesList.map((x: Status) => (
                <div key={x} style={{ marginRight: "5px" }}>
                    <StatusIndicator statuses={[x]} />
                </div>
            ))}
        </div>
    ))
    .add("OK", () => <StatusIndicator statuses={[Status.OK]} />)
    .add("NODATA", () => <StatusIndicator statuses={[Status.NODATA]} />)
    .add("WARN", () => <StatusIndicator statuses={[Status.WARN]} />)
    .add("ERROR", () => <StatusIndicator statuses={[Status.ERROR]} />)
    .add("EXCEPTION", () => <StatusIndicator statuses={[Status.EXCEPTION]} />)
    .add("DEL", () => <StatusIndicator statuses={[Status.DEL]} />)
    .add("NODATA & WARN", () => <StatusIndicator statuses={[Status.NODATA, Status.WARN]} />)
    .add("NODATA & ERROR", () => <StatusIndicator statuses={[Status.NODATA, Status.ERROR]} />)
    .add("ERROR & WARN", () => <StatusIndicator statuses={[Status.ERROR, Status.WARN]} />)
    .add("NODATA & ERROR & WARN", () => (
        <StatusIndicator statuses={[Status.NODATA, Status.ERROR, Status.WARN]} />
    ))
    .add("OK & NODATA & ERROR & WARN", () => (
        <StatusIndicator statuses={[Status.OK, Status.NODATA, Status.ERROR, Status.WARN]} />
    ))
    .add("disabled", () => (
        <StatusIndicator disabled statuses={[Status.NODATA, Status.ERROR, Status.WARN]} />
    ));
