// @flow

export type Contact = {|
    id: string;
    type: string;
    user: string;
    value: string;
|};

export type ContactList = {|
    list: Array<Contact>;
|};
