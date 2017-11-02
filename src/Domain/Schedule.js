// @flow
export const DaysOfWeek = {
    Mon: 'Mon',
    Tue: 'Tue',
    Wed: 'Wed',
    Thu: 'Thu',
    Fri: 'Fri',
    Sat: 'Sat',
    Sun: 'Sun',
};

export type DayOfWeek = $Keys<typeof DaysOfWeek>;

export interface Day {
    enabled: boolean;
    name: DayOfWeek;
}

export interface Schedule {
    startOffset: number;
    endOffset: number;
    tzOffset: number;
    days: Array<Day>;
}

export const WholeWeek: DayOfWeek[] = Object.keys(DaysOfWeek);

export function createSchedule(days: DayOfWeek[]): Schedule {
    return {
        days: Object.keys(DaysOfWeek).map(x => ({ enabled: days.includes(x), name: x })),
        tzOffset: -300,
        startOffset: 0,
        endOffset: 1439,
    };
}
