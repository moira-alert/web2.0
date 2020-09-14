export enum Status {
    DEL = "DEL",
    EXCEPTION = "EXCEPTION",
    NODATA = "NODATA",
    ERROR = "ERROR",
    WARN = "WARN",
    OK = "OK",
}

export const StatusesList = [
    Status.DEL,
    Status.EXCEPTION,
    Status.NODATA,
    Status.ERROR,
    Status.WARN,
    Status.OK,
];

export enum StatusesCaptions {
    DEL = "DEL",
    EXCEPTION = "EXCEPTION",
    NODATA = "NODATA",
    ERROR = "ERROR",
    WARN = "WARN",
    OK = "OK",
}

export const StatusesColors = {
    DEL: "#000",
    EXCEPTION: "#ff5722",
    NODATA: "#9e9e9e",
    ERROR: "#ff5722",
    WARN: "#ffc107",
    OK: "#00bfa5",
};

export const StatusesWeight = {
    DEL: 100000,
    EXCEPTION: 100000,
    NODATA: 1000,
    ERROR: 100,
    WARN: 1,
    OK: 0,
};

export const StatusesInOrder: Status[] = [
    Status.EXCEPTION,
    Status.NODATA,
    Status.ERROR,
    Status.WARN,
    Status.OK,
    Status.DEL,
];

export function getStatusColor(status: Status): string {
    return StatusesColors[status];
}

export function getStatusCaption(status: Status): StatusesCaptions {
    return StatusesCaptions[status];
}

export function getStatusWeight(status: Status): number {
    return StatusesWeight[status];
}
