import * as React from "react";
import { Contact } from "../../Domain/Contact";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import { isEmptyString } from "../../helpers/isEmptyString";

type Props = {
    contact: Contact;
    className?: string;
};

export default function ContactInfo({ contact, className }: Props): React.ReactElement {
    return (
        <div className={className}>
            <ContactTypeIcon type={contact.type} />
            &nbsp;
            <span>{isEmptyString(contact.name) ? contact.value : contact.name}</span>
        </div>
    );
}
