// @flow
import type { Contact } from './Contact';
import type { Subscription } from './Subscription';

export interface Settings {
    login: string;
    contacts: Array<Contact>;
    subscriptions: Array<Subscription>;
}
