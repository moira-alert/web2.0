import React, { FC } from "react";
import { Contact } from "../../Domain/Contact";
import { FixedSizeList as List } from "react-window";
import { getCoreRowModel, ColumnDef, flexRender, useReactTable } from "@tanstack/react-table";
import {
    LIST_HEIGHT,
    MAX_LIST_LENGTH_BEFORE_SCROLLABLE,
    ROW_HEIGHT,
    getTotalItemSize,
} from "../TagList/TagList";
import classNames from "classnames/bind";

import styles from "./AllContactsTable.less";

const cn = classNames.bind(styles);

interface IAllContactsTableProps {
    contacts: Contact[];
    contactsColumn: keyof Contact | null;
    handleSetEditableContact: (contact: Contact) => void;
    handleSetFilterContactsColumn: (column: keyof Contact | null) => void;
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
            accessorFn: (contact) => contact.user || contact.team,
        },
    ];

    const table = useReactTable({
        data: contacts,
        columns,
        enableColumnResizing: true,
        columnResizeMode: "onChange",
        getCoreRowModel: getCoreRowModel(),
    });

    const isListLongEnoughToScroll = contacts.length > MAX_LIST_LENGTH_BEFORE_SCROLLABLE;

    return (
        <>
            {table.getHeaderGroups().map((headerGroup) => (
                <div key={headerGroup.id} className={cn("contacts-header-row")}>
                    {headerGroup.headers.map((header) => (
                        <div
                            key={header.id}
                            onClick={() => {
                                if (header.column.columnDef.id === contactsColumn) {
                                    handleSetFilterContactsColumn(null);
                                    return;
                                }
                                handleSetFilterContactsColumn(
                                    header.column.columnDef.id as keyof Contact
                                );
                            }}
                            className={cn("header-cell", {
                                active: contactsColumn === header.column.columnDef.id,
                            })}
                            style={{
                                flex: `1 1 ${header.getSize()}px`,
                            }}
                        >
                            {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}

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
                        isListLongEnoughToScroll ? LIST_HEIGHT : getTotalItemSize(contacts.length)
                    }
                    itemCount={table.getRowModel().rows.length}
                    itemSize={ROW_HEIGHT}
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
