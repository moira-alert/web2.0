import React, { FC, useMemo, useState } from "react";
import { Input, SidePage, Button } from "@skbkontur/react-ui";
import { AllContactsTable } from "./Components/AllContactsTable";
import { Contact } from "../../Domain/Contact";
import ContactEditModal from "../ContactEditModal/ContactEditModal";

export interface ExtendedContact extends Contact {
    isUnused: boolean;
}

interface IAllContactsSidePage {
    contacts: ExtendedContact[];
    closeSidePage: () => void;
}

export const AllContactsSidePage: FC<IAllContactsSidePage> = ({ contacts, closeSidePage }) => {
    const [findContact, setFindContact] = useState<string>("");
    const [editableContact, setEditableContact] = useState<Contact | null>(null);
    const [filterColumn, setfilterColumn] = useState<keyof Contact | null>(null);

    const handleEditContact = (update: Contact) => {
        setEditableContact((prev) => ({ ...prev, ...update }));
    };

    const handleSetFilterColumn = (column: keyof Contact | null) => {
        setfilterColumn(column);
    };

    const filteredContacts = useMemo(() => {
        if (!findContact.trim() || !filterColumn) {
            return contacts;
        }
        return contacts.filter((contact) =>
            contact[filterColumn]?.toLowerCase().includes(findContact.toLowerCase().trim())
        );
    }, [findContact, contacts]);

    const handleCloseModal = () => {
        setEditableContact(null);
    };

    return (
        <>
            {editableContact && (
                <ContactEditModal
                    onChange={handleEditContact}
                    onCancel={handleCloseModal}
                    contactInfo={editableContact}
                />
            )}
            <SidePage onClose={closeSidePage} blockBackground>
                <SidePage.Header>Contacts</SidePage.Header>
                <SidePage.Body>
                    <SidePage.Container style={{ height: "calc(100% - 82px)" }}>
                        <Input
                            width={"100%"}
                            placeholder="Click on the corresponding column header and start typing"
                            onValueChange={setFindContact}
                            style={{ marginBottom: "10px" }}
                        />

                        <AllContactsTable
                            contacts={filteredContacts}
                            contactsColumn={filterColumn}
                            handleSetEditableContact={handleEditContact}
                            handleSetFilterContactsColumn={handleSetFilterColumn}
                        />
                    </SidePage.Container>
                </SidePage.Body>
                <SidePage.Footer panel>
                    <Button onClick={closeSidePage}>Close</Button>
                </SidePage.Footer>
            </SidePage>
        </>
    );
};
