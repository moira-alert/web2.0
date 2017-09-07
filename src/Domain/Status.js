// @flow
export const Statuses = {
    NODATA: 'NODATA',
    WARN: 'WARN',
    ERROR: 'ERROR',
    EXCEPTION: 'EXCEPTION',
    DEL: 'DEL',
    OK: 'OK',
};

export const StatusesCaptions = {
    NODATA: 'NODATA',
    WARN: 'WARN',
    ERROR: 'ERROR',
    EXCEPTION: 'EXCEPTION',
    DEL: 'DEL',
    OK: 'OK',
};

export const StatusesColors = {
    NODATA: '#9e9e9e',
    WARN: '#ffc107',
    ERROR: '#ff5722',
    EXCEPTION: '#ff5722',
    DEL: '#000',
    OK: '#00bfa5',
};

export type Status = $Keys<typeof Statuses>;

export function getStatusColor(status: Status): string {
    return StatusesColors[status];
}

export function getStatusCaption(status: Status): string {
    return StatusesCaptions[status];
}
