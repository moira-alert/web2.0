// @flow

export type ContactConfig = {|
    type: string;
    validation: string;
    title?: string;
    img?: string;
    icon?: string;
    help?: string;
|};

export type Config = {|
    apiUrl: string;
    contacts: Array<ContactConfig>;
    supportEmail: string;
    paging: {|
        triggerList: number;
        eventHistory: number;
    |};
|};
