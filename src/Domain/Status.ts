export enum Statuses {
    DEL = "DEL",
    EXCEPTION = "EXCEPTION",
    NODATA = "NODATA",
    ERROR = "ERROR",
    WARN = "WARN",
    OK = "OK",
}

export const StatusesList = [
    Statuses.DEL,
    Statuses.EXCEPTION,
    Statuses.NODATA,
    Statuses.ERROR,
    Statuses.WARN,
    Statuses.OK,
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

export const StatusesInOrder: Statuses[] = [
    Statuses.EXCEPTION,
    Statuses.NODATA,
    Statuses.ERROR,
    Statuses.WARN,
    Statuses.OK,
    Statuses.DEL,
];

export function getStatusColor(status: Statuses): string {
    return StatusesColors[status];
}

export function getStatusCaption(status: Statuses): StatusesCaptions {
    return StatusesCaptions[status];
}

export function getStatusWeight(status: Statuses): number {
    return StatusesWeight[status];
}
