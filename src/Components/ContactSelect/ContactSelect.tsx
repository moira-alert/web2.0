import * as React from "react";
import TrashIcon from "@skbkontur/react-icons/Trash";
import difference from "lodash/difference";
import union from "lodash/union";
import { ComboBox } from "@skbkontur/react-ui/components/ComboBox";
import { Contact } from "../../Domain/Contact";
import { notUndefined } from "../../helpers/common";
import A11yButtonWrapper from "../A11yButtonWrapper/A11yButtonWrapper";
import ContactInfo from "../ContactInfo/ContactInfo";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import classNames from "classnames/bind";

import styles from "./ContactSelect.less";

const cn = classNames.bind(styles);

type Props = {
    contactIds: Array<string>;
    onChange: (contactList: Array<string>) => void;
    availableContacts: Array<Contact>;
    error?: boolean;
    warning?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    onMouseEnter?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export default class ContactSelect extends React.Component<Props> {
    static isContactMatch(contact: Contact, query: string): boolean {
        if (query == null || query.trim() === "") {
            return true;
        }
        return contact.value.toLowerCase().includes(query.toLowerCase());
    }

    render(): React.ReactNode {
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
                    .map((x) => availableContacts.find((contact) => contact.id === x))
                    .filter(notUndefined)
                    .map((x) => (
                        <div key={x.id} className={cn("contact")}>
                            <ContactInfo contact={x} />
                            <A11yButtonWrapper onClick={() => this.handleRemoveContact(x)}>
                                <TrashIcon />
                            </A11yButtonWrapper>
                        </div>
                    ))}
                <div>
                    <ComboBox
                        data-tid="Select delivery channel"
                        error={error}
                        warning={warning}
                        width="100%"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onValueChange={this.handleChangeContactToAdd}
                        getItems={this.getContactsForComboBox}
                        totalCount={availableContacts.length}
                        renderTotalCount={(found, total) =>
                            found < total && found !== 0
                                ? `${found} from ${total} contacts are shown.`
                                : null
                        }
                        placeholder="Select delivery channel"
                        renderNotFound={() => "No delivery channels found"}
                        renderItem={(item) => (
                            <>
                                <ContactTypeIcon type={item.type} /> {item.label}
                            </>
                        )}
                    />
                </div>
            </div>
        );
    }

    handleChangeContactToAdd = (value: { value: string; label: string }): void => {
        const { onChange, contactIds } = this.props;
        onChange(union(contactIds, [value.value]));
    };

    handleRemoveContact = (contact: Contact): void => {
        const { onChange, contactIds } = this.props;
        onChange(difference(contactIds, [contact.id]));
    };

    getContactsForComboBox = async (
        query: string
    ): Promise<Array<{ value: string; label: string; type: string }>> => {
        const { contactIds, availableContacts } = this.props;
        const foundContacts = availableContacts
            .filter((x) => !contactIds.includes(x.id) && ContactSelect.isContactMatch(x, query))
            .slice(0, 10)
            .map((x) => ({
                value: x.id,
                label: x.value,
                type: x.type,
            }));

        return foundContacts;
    };
}
