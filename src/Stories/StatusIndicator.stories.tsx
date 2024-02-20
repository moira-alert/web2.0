import * as React from "react";
import { Status, StatusesList } from "../Domain/Status";
import StatusIndicator from "../Components/StatusIndicator/StatusIndicator";

export default {
    title: "StatusIndicator",
};

export const AllSingleColorVariants = {
    render: () => (
        <div style={{ display: "flex" }}>
            {StatusesList.map((x: Status) => (
                <div key={x} style={{ marginRight: "5px" }}>
                    <StatusIndicator statuses={[x]} />
                </div>
            ))}
        </div>
    ),

    name: "All single color variants",
};

export const Ok = {
    render: () => <StatusIndicator statuses={[Status.OK]} />,
    name: "OK",
};

export const Nodata = {
    render: () => <StatusIndicator statuses={[Status.NODATA]} />,
    name: "NODATA",
};

export const Warn = {
    render: () => <StatusIndicator statuses={[Status.WARN]} />,
    name: "WARN",
};

export const Error = {
    render: () => <StatusIndicator statuses={[Status.ERROR]} />,
    name: "ERROR",
};

export const Exception = {
    render: () => <StatusIndicator statuses={[Status.EXCEPTION]} />,
    name: "EXCEPTION",
};

export const Del = {
    render: () => <StatusIndicator statuses={[Status.DEL]} />,
    name: "DEL",
};

export const NodataWarn = {
    render: () => <StatusIndicator statuses={[Status.NODATA, Status.WARN]} />,
    name: "NODATA & WARN",
};

export const NodataError = {
    render: () => <StatusIndicator statuses={[Status.NODATA, Status.ERROR]} />,
    name: "NODATA & ERROR",
};

export const ErrorWarn = {
    render: () => <StatusIndicator statuses={[Status.ERROR, Status.WARN]} />,
    name: "ERROR & WARN",
};

export const NodataErrorWarn = {
    render: () => <StatusIndicator statuses={[Status.NODATA, Status.ERROR, Status.WARN]} />,

    name: "NODATA & ERROR & WARN",
};

export const OkNodataErrorWarn = {
    render: () => (
        <StatusIndicator statuses={[Status.OK, Status.NODATA, Status.ERROR, Status.WARN]} />
    ),

    name: "OK & NODATA & ERROR & WARN",
};

export const Disabled = {
    render: () => (
        <StatusIndicator disabled statuses={[Status.NODATA, Status.ERROR, Status.WARN]} />
    ),

    name: "disabled",
};
