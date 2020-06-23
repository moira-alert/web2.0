// @flow
import * as React from "react";
import type { Contact } from "../../Domain/Contact";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";

type Props = {
    contact: Contact,
};

export default function ContactInfo(props: Props): React.Node {
    const { contact } = props;
    return (
        <>
            <ContactTypeIcon type={contact.type} /> {contact.value}
        </>
    );
}
