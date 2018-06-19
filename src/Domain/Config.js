// @flow

export type ContactConfig = {|
    type: string,
    validation: string,
    title?: string,
    help?: string,
|};

export type Config = {|
    supportEmail: string,
    contacts: Array<ContactConfig>,
    remoteAllowed?: boolean,
|};
