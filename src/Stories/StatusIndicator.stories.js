// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { Statuses } from "../Domain/Status";
import StatusIndicator from "../Components/StatusIndicator/StatusIndicator";

storiesOf("StatusIndicator", module)
    .add("All single color variants", () => {
        return (
            <div style={{ display: "flex" }}>
                {Object.keys(Statuses).map(x => (
                    <div key={x} style={{ marginRight: "5px" }}>
                        <StatusIndicator statuses={[x]} />
                    </div>
                ))}
            </div>
        );
    })
    .add("OK", () => <StatusIndicator statuses={[Statuses.OK]} />)
    .add("NODATA", () => <StatusIndicator statuses={[Statuses.NODATA]} />)
    .add("WARN", () => <StatusIndicator statuses={[Statuses.WARN]} />)
    .add("ERROR", () => <StatusIndicator statuses={[Statuses.ERROR]} />)
    .add("EXCEPTION", () => <StatusIndicator statuses={[Statuses.EXCEPTION]} />)
    .add("DEL", () => <StatusIndicator statuses={[Statuses.DEL]} />)
    .add("NODATA & WARN", () => <StatusIndicator statuses={[Statuses.NODATA, Statuses.WARN]} />)
    .add("NODATA & ERROR", () => <StatusIndicator statuses={[Statuses.NODATA, Statuses.ERROR]} />)
    .add("ERROR & WARN", () => <StatusIndicator statuses={[Statuses.ERROR, Statuses.WARN]} />)
    .add("NODATA & ERROR & WARN", () => <StatusIndicator statuses={[Statuses.NODATA, Statuses.ERROR, Statuses.WARN]} />)
    .add("disabled", () => <StatusIndicator disabled statuses={[Statuses.NODATA, Statuses.ERROR, Statuses.WARN]} />);
