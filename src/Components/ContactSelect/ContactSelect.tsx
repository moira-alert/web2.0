import TrashIcon from "@skbkontur/react-icons/Trash";
import difference from "lodash/difference";
import union from "lodash/union";
import * as React from "react";
import { ComboBox } from "@skbkontur/react-ui/components/ComboBox";
import A11yButtonWrapper from "../A11yButtonWrapper/A11yButtonWrapper";
import ContactInfo from "../ContactInfo/ContactInfo";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import { Contact } from "../../Domain/Contact";
import cn from "./ContactSelect.less";

type Props = {
    contactIds: Array<string>;
    onChange: (arg0: Array<string>) => void;
    availableContacts: Array<Contact>;
    error?: boolean;
    warning?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    onMouseEnter?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined;
    onMouseLeave?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined;
};

function notUndefined<T>(x: T | undefined): x is T {
    return x !== undefined;
}

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
                            <ContactInfo contact={x} />{" "}
                            <A11yButtonWrapper onClick={() => this.handleRemoveContact(x)}>
                                <TrashIcon />
                            </A11yButtonWrapper>
                        </div>
                    ))}
                <div>
                    <ComboBox
                        error={error}
                        warning={warning}
                        width="100%"
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onValueChange={this.handleChangeContactToAdd}
                        getItems={this.getContactsForComboBox}
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

    handleChangeContactToAdd = <T extends { value: string; label: string }>(value: T): void => {
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
        return availableContacts
            .filter((x) => !contactIds.includes(x.id))
            .filter((x) => ContactSelect.isContactMatch(x, query))
            .slice(0, 10)
            .map((x) => ({
                value: x.id,
                label: x.value,
                type: x.type,
            }));
    };
}
