import React, { useState } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Filter } from "@skbkontur/react-icons";
import { Contact } from "../../../Domain/Contact";
import { Checkbox, DropdownMenu, MenuItem, ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
import ContactTypeIcon from "../../../Components/ContactTypeIcon/ContactTypeIcon";
import { ArrowChevronDown } from "@skbkontur/react-icons";
import TagDropdownSelect from "../../../Components/TagDropdownSelect/TagDropdownSelect";
import { filterSubscriptions } from "../../../Domain/FilterSubscriptions";
import { Subscription } from "../../../Domain/Subscription";

interface IFilterSubscriptionButtons {
    contacts: Contact[];
    subscriptions: Subscription[];
}

export const FilterSubscriptionButtons = ({
    contacts,
    subscriptions,
}: IFilterSubscriptionButtons) => {
    const [filterContactIDs, setFilterContactIDs] = useState<string[]>([]);
    const [filterTags, setFilterTags] = useState<string[]>([]);

    const { filteredSubscriptions, availableTags, availableContactIDs } = filterSubscriptions(
        subscriptions,
        filterTags,
        filterContactIDs
    );

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

    const handleFilterTagsChange = (tags: string[]) => {
        setFilterTags(tags);
    };

    const handleSetCheckbox = (contactID: string) => {
        const contactIndex = filterContactIDs.indexOf(contactID);
        if (contactIndex === -1) {
            setFilterContactIDs((prev) => [...prev, contactID]);
        } else {
            setFilterContactIDs((prev) =>
                prev.filter((id) => {
                    return id !== contactID;
                })
            );
        }
    };

    const FilterButtons = (
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
                                onValueChange={() => handleSetCheckbox(contact.id)}
                            >
                                <ContactTypeIcon type={contact.type} />
                                &nbsp;
                                {contact.value}
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

    return { FilterButtons, filteredSubscriptions };
};
