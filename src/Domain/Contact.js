// @flow
import type { ContactType } from './ContactType';

export interface Contact {
    id: string;
    type: ContactType;
    user: string;
    value: string;
}

export interface ContactList {
    list: Array<Contact>;
}
