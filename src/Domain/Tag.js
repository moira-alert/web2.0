// @flow
import type { Subscribtion } from './Subscribtion';

export type TagStat = {|
    data: {|
        maintenance?: boolean | number;
    |};
    name: string;
    subscriptions: Array<Subscribtion>;
    triggers: Array<string>;
|};
