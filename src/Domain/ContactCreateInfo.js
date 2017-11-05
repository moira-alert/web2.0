// @flow
import type { ContactType } from "./ContactType";

export type ContactCreateInfo = {
    value: string,
    type: ContactType,
    user: string,
};
