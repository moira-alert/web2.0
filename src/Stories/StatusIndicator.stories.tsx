import React from "react";
import { Status, StatusesList } from "../Domain/Status";
import StatusIndicator from "../Components/StatusIndicator/StatusIndicator";

export default {
    title: "StatusIndicator",
    component: StatusIndicator,
};

export const AllSingleColorVariants = () => (
    <div style={{ display: "flex" }}>
        {StatusesList.map((x: Status) => (
            <div key={x} style={{ marginRight: "5px" }}>
                <StatusIndicator statuses={[x]} />
            </div>
        ))}
    </div>
);

export const OK = () => <StatusIndicator statuses={[Status.OK]} />;

export const NODATA = () => <StatusIndicator statuses={[Status.NODATA]} />;

export const WARN = () => <StatusIndicator statuses={[Status.WARN]} />;

export const ERROR = () => <StatusIndicator statuses={[Status.ERROR]} />;

export const EXCEPTION = () => <StatusIndicator statuses={[Status.EXCEPTION]} />;

export const DEL = () => <StatusIndicator statuses={[Status.DEL]} />;

export const NODATA_WARN = () => <StatusIndicator statuses={[Status.NODATA, Status.WARN]} />;

export const ERROR_WARN = () => <StatusIndicator statuses={[Status.ERROR, Status.WARN]} />;

export const NODATA_ERROR_WARN = () => (
    <StatusIndicator statuses={[Status.NODATA, Status.ERROR, Status.WARN]} />
);

export const OK_NODATA_ERROR_WARN = () => (
    <StatusIndicator statuses={[Status.OK, Status.NODATA, Status.ERROR, Status.WARN]} />
);

export const disabled = () => (
    <StatusIndicator disabled statuses={[Status.NODATA, Status.ERROR, Status.WARN]} />
);
