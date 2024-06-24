import React, { useState, useEffect, FC, useMemo } from "react";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import ContactEditModal from "../Components/ContactEditModal/ContactEditModal";
import { Input } from "@skbkontur/react-ui/components/Input";
import { AllContactsTable } from "../Components/AllContatcsTable/AllContactsTable";
import { Contact } from "../Domain/Contact";
import { useGetAllContactsQuery } from "../services/ContactApi";
import { useModal } from "../hooks/useModal";
import { useAppSelector } from "../store/hooks";
import { UIState } from "../store/selectors";

const ContactsContainer: FC = () => {
    const { data: contacts } = useGetAllContactsQuery();
    const { error, isLoading } = useAppSelector(UIState);
    const { isModalOpen, closeModal, openModal } = useModal();
    const [findContact, setFindContact] = useState<string>("");
    const [editableContact, setEditableContact] = useState<Contact | null>(null);
    const [filterColumn, setfilterColumn] = useState<keyof Contact | null>(null);

    const handleEditContact = (update: Contact) => {
        openModal();
        setEditableContact((prev) => ({ ...prev, ...update }));
    };

    const handleSetFilterColumn = (column: keyof Contact | null) => {
        setfilterColumn(column);
    };

    const filteredContacts = useMemo(() => {
        if (!findContact.trim() || !filterColumn) {
            return contacts;
        }
        return contacts?.filter((contact) =>
            contact[filterColumn]?.toLowerCase().includes(findContact.toLowerCase().trim())
        );
    }, [findContact, contacts]);

    useEffect(() => {
        setDocumentTitle("Contacts");
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <LayoutTitle>Contacts: {filteredContacts?.length}</LayoutTitle>

                {isModalOpen && (
                    <ContactEditModal onCancel={closeModal} contactInfo={editableContact} />
                )}

                <Input
                    width={"100%"}
                    placeholder="Click on the corresponding column header and start typing"
                    onValueChange={setFindContact}
                    style={{ marginBottom: "10px" }}
                />

                <AllContactsTable
                    contacts={filteredContacts ?? []}
                    contactsColumn={filterColumn}
                    handleSetEditableContact={handleEditContact}
                    handleSetFilterContactsColumn={handleSetFilterColumn}
                />
            </LayoutContent>
        </Layout>
    );
};

export default ContactsContainer;
