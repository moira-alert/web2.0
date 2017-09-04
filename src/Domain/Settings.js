// @flow

import type { Contact } from './Contact';
import type { Subscribtion } from './Subscribtion';

export type Settings = {|
    login: string;
    contacts: Array<Contact>;
    subscriptions: Array<Subscribtion>;
|};
