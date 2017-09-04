// @flow
export const Statuses = {
    NODATA: 'NODATA',
    WARN: 'WARN',
    ERROR: 'ERROR',
    OK: 'OK',
};

export const StatusesCaptions = {
    OK: 'OK',
    NODATA: 'NODATA',
    WARN: 'WARN',
    ERROR: 'ERROR',
};

export const StatusesColors = {
    OK: '#00bfa5',
    NODATA: '#9e9e9e',
    WARN: '#ffc107',
    ERROR: '#ff5722',
};

export type Status = $Keys<typeof Statuses>;

export function getStatusColor(status: Status): string {
    return StatusesColors[status];
}

export function getStatusCaption(status: Status): string {
    return StatusesCaptions[status];
}
