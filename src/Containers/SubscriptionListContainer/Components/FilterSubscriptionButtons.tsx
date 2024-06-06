import React from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Filter } from "@skbkontur/react-icons";
import { Contact } from "../../../Domain/Contact";
import { Checkbox, DropdownMenu, MenuItem, ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
import ContactInfo from "../../../Components/ContactInfo/ContactInfo";
import { ArrowChevronDown } from "@skbkontur/react-icons";
import TagDropdownSelect from "../../../Components/TagDropdownSelect/TagDropdownSelect";

interface IFilterSubscriptionButtons {
    contacts: Contact[];
    filterContactIDs: string[];
    availableContactIDs: string[];
    filterTags: string[];
    availableTags: string[];
    handleFilterContactsChange: (contactID: string) => void;
    handleFilterTagsChange: (tags: string[]) => void;
}

export const FilterSubscriptionButtons = ({
    contacts,
    filterContactIDs,
    availableContactIDs,
    filterTags,
    availableTags,
    handleFilterContactsChange,
    handleFilterTagsChange,
}: IFilterSubscriptionButtons) => {
    const renderFilterByContactCaption = ({ openMenu }: { openMenu: () => void }) => {
        return (
            <Button
                width={180}
                icon={filterContactIDs.length ? <Filter /> : <ArrowChevronDown />}
                use="default"
                onClick={openMenu}
            >
                Filter by contact
            </Button>
        );
    };

    const availableContacts = contacts.filter((contact) =>
        availableContactIDs?.includes(contact.id)
    );

    return (
        <>
            <DropdownMenu menuMaxHeight={300} caption={renderFilterByContactCaption}>
                {availableContacts.map((contact) => (
                    <ThemeContext.Provider
                        key={contact.id}
                        value={ThemeFactory.create({
                            menuItemHoverBg: "initial",
                        })}
                    >
                        <MenuItem>
                            <Checkbox
                                checked={filterContactIDs.includes(contact.id)}
                                style={{
                                    alignItems: "center",
                                    padding: "0",
                                }}
                                onValueChange={() => handleFilterContactsChange(contact.id)}
                            >
                                <ContactInfo contact={contact} />
                            </Checkbox>
                        </MenuItem>
                    </ThemeContext.Provider>
                ))}
            </DropdownMenu>
            <TagDropdownSelect
                width={180}
                value={filterTags}
                availableTags={availableTags}
                onChange={handleFilterTagsChange}
                placeholder="Filter by tag"
            />
        </>
    );
};
