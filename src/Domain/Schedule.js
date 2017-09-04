// @flow

export type Day = {|
    enabled: boolean;
    name: string;
|};

export type Schedule = {|
    startOffset: number;
    endOffset: number;
    tzOffset: number;
    days: Array<Day>;
|};
