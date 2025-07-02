import React, { FC } from "react";
import { Contact } from "../../Domain/Contact";
import { FixedSizeList as List } from "react-window";
import { getCoreRowModel, ColumnDef, flexRender, useReactTable } from "@tanstack/react-table";
import RouterLink from "../RouterLink/RouterLink";
import { getPageLink } from "../../Domain/Global";
import {
    MAX_TAG_LIST_LENGTH_BEFORE_SCROLLABLE,
    TAG_LIST_HEIGHT,
    TAG_ROW_HEIGHT,
} from "../../Constants/heights";
import { getTotalItemSize } from "../TagList/TagList";
import { TContactFilterColumns } from "../../Containers/ContactsContainer";
import classNames from "classnames/bind";

import styles from "./AllContactsTable.module.less";

const cn = classNames.bind(styles);

interface IAllContactsTableProps {
    contacts: Contact[];
    contactsColumn: TContactFilterColumns | null;
    handleSetEditableContact: (contact: Contact) => void;
    handleSetFilterContactsColumn: (column: TContactFilterColumns | null) => void;
}

export const AllContactsTable: FC<IAllContactsTableProps> = ({
    contacts,
    contactsColumn,
    handleSetEditableContact,
    handleSetFilterContactsColumn,
}) => {
    const columns: ColumnDef<Contact>[] = [
        {
            header: "Type",
            id: "type",
            accessorFn: (contact) => contact.type,
            minSize: 0,
        },
        {
            header: "Value",
            id: "value",
            accessorFn: (contact) => contact.value,
        },
        {
            header: "ID",
            id: "id",
            accessorFn: (contact) => contact.id,
        },

        {
            header: "Name",
            id: "name",
            accessorFn: (contact) => contact.name,
        },
        {
            header: "User or TeamID",
            id: "user",
            accessorFn: (contact) => contact.user || contact.team_id,
            cell: ({ cell }) =>
                cell.row.original.user || (
                    <RouterLink to={getPageLink("teamSettings", cell.row.original.team_id)}>
                        {cell.row.original.team_id}
                    </RouterLink>
                ),
        },
    ];

    const table = useReactTable({
        data: contacts,
        columns,
        enableColumnResizing: true,
        columnResizeMode: "onChange",
        getCoreRowModel: getCoreRowModel(),
    });

    const isListLongEnoughToScroll = contacts.length > MAX_TAG_LIST_LENGTH_BEFORE_SCROLLABLE;

    return (
        <>
            {table.getHeaderGroups().map((headerGroup) => (
                <div key={headerGroup.id} className={cn("contacts-header-row")}>
                    {headerGroup.headers.map((header) => (
                        <div
                            key={header.id}
                            className={cn("header-cell", {
                                active: contactsColumn === header.column.columnDef.id,
                            })}
                            style={{
                                flex: `1 1 ${header.getSize()}px`,
                            }}
                        >
                            <div
                                onClick={() => {
                                    if (header.column.columnDef.id === contactsColumn) {
                                        handleSetFilterContactsColumn(null);
                                        return;
                                    }
                                    handleSetFilterContactsColumn(
                                        header.column.columnDef.id as keyof Omit<Contact, "score">
                                    );
                                }}
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                      )}
                            </div>

                            {header.column.getCanResize() && (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    onMouseDown={header.getResizeHandler()}
                                    onTouchStart={header.getResizeHandler()}
                                    className={cn("resizer", {
                                        isResizing: Boolean(header.column.getIsResizing()),
                                    })}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ))}

            {contacts.length ? (
                <List
                    height={
                        isListLongEnoughToScroll
                            ? TAG_LIST_HEIGHT
                            : getTotalItemSize(contacts.length)
                    }
                    itemCount={table.getRowModel().rows.length}
                    itemSize={TAG_ROW_HEIGHT}
                    width="100%"
                >
                    {({ index, style }) => {
                        const row = table.getRowModel().rows[index];
                        const contact = row.original;
                        return (
                            <div
                                key={row.id}
                                className={cn("contacts-row", "clickable")}
                                style={style}
                                onClick={() => handleSetEditableContact(contact)}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <div
                                        key={cell.id}
                                        className={cn("cell")}
                                        style={{
                                            flex: `1 1 ${cell.column.getSize()}px`,
                                        }}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                ))}
                            </div>
                        );
                    }}
                </List>
            ) : (
                <div className={cn("empty-result")}>No contacts found</div>
            )}
        </>
    );
};
