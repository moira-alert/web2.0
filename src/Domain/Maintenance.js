// @flow
export const Maintenances = {
    off: 'off',
    quarterHour: 'quarterHour',
    oneHour: 'oneHour',
    threeHours: 'threeHours',
    sixHours: 'sixHours',
    oneDay: 'oneDay',
    oneWeek: 'oneWeek',
};

export const MaintenanceTimes = {
    off: 0,
    quarterHour: 15,
    oneHour: 60,
    threeHours: 180,
    sixHours: 360,
    oneDay: 1440,
    oneWeek: 10080,
};

export const MaintenanceCaptions = {
    off: 'Off',
    quarterHour: '15 min',
    oneHour: '1 hour',
    threeHours: '3 hours',
    sixHours: '6 hours',
    oneDay: '1 day',
    oneWeek: '1 week',
};

export type Maintenance = $Keys<typeof Maintenances>;

export function getMaintenanceCaption(maintenance: Maintenance): string {
    return MaintenanceCaptions[maintenance];
}

export function getMaintenanceTime(maintenance: Maintenance): number {
    return MaintenanceTimes[maintenance];
}
