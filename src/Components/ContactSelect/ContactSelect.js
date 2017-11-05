// @flow
import * as React from 'react';
import { union, difference } from 'lodash';
import type { Contact } from '../../Domain/Contact';
import Link from 'retail-ui/components/Link';
import ComboBox from 'retail-ui/components/ComboBox';
import ContactInfo from '../ContactInfo/ContactInfo';
import cn from './ContactSelect.less';

type Props = {
    contactIds: Array<string>;
    onChange: (Array<string>) => void;
    availableContacts: Array<Contact>;
    error?: boolean;
    warning?: boolean;
    onFocus?: Event => void;
    onBlur?: Event => void;
    onMouseEnter?: Event => void;
    onMouseLeave?: Event => void;
};

type State = {
    contactIdToAdd: ?string;
};

export default class TagDropdownSelect extends React.Component<Props, State> {
    props: Props;
    state: State = {
        contactIdToAdd: null,
    };

    getContactsForComboBox = async (query: string): Promise<Array<{ value: string; label: string }>> => {
        const { contactIds, availableContacts } = this.props;
        return availableContacts
            .filter(x => !contactIds.includes(x.id))
            .filter(x => this.isContactMatch(x, query))
            .slice(0, 10)
            .map(x => ({
                value: x.id,
                label: x.value,
            }));
    };

    isContactMatch(contact: Contact, query: string): boolean {
        if (query == null || query.trim() === '') {
            return true;
        }
        return contact.value.toLowerCase().includes(query.toLowerCase());
    }

    handleChangeContactToAdd = (e: Event, value: { value: string; label: string }) => {
        const { onChange, contactIds } = this.props;
        onChange(union(contactIds, [value.value]));
    };

    handleRemoveContact = (contact: Contact) => {
        const { onChange, contactIds } = this.props;
        onChange(difference(contactIds, [contact.id]));
    };

    render(): React.Node {
        const {
            contactIds,
            availableContacts,
            onFocus,
            onBlur,
            error,
            warning,
            onMouseEnter,
            onMouseLeave,
        } = this.props;
        return (
            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                {contactIds
                    .map(x => availableContacts.find(contact => contact.id === x))
                    .filter(Boolean)
                    .map(x => (
                        <div className={cn('contact')}>
                            <ContactInfo contact={x} />{' '}
                            <Link icon={'remove'} use='danger' onClick={() => this.handleRemoveContact(x)} />
                        </div>
                    ))}
                <div>
                    <ComboBox
                        error={error}
                        warning={warning}
                        width='100%'
                        value={null}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={this.handleChangeContactToAdd}
                        getItems={this.getContactsForComboBox}
                        placeholder='Select delivery channel'
                        renderNotFound={() => 'No delivery channels found'}
                    />
                </div>
            </div>
        );
    }
}
