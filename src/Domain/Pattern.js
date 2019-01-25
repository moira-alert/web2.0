// @flow
import type { Trigger } from "./Trigger";

export type Pattern = {|
    metrics: Array<string>,
    pattern: string,
    triggers: Array<Trigger>,
|};

export type PatternList = {|
    list: Array<Pattern>,
|};
