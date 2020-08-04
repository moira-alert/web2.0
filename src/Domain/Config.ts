export type ContactConfig = {
    type: string,
    label: string,
    validation?: string,
    placeholder?: string,
    help?: string,
};

export type Config = {
    supportEmail: string,
    contacts: Array<ContactConfig>,
    remoteAllowed?: boolean,
};
