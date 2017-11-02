// @flow
import React from 'react';
import type { Contact } from '../../Domain/Contact';
import ContactTypeIcon from '../ContactTypeIcon/ContactTypeIcon';

export default function ContactInfo({ contact }: { contact: Contact }): React.Element<*> {
    return (
        <span>
            <ContactTypeIcon type={contact.type} /> {contact.value}
        </span>
    );
}
