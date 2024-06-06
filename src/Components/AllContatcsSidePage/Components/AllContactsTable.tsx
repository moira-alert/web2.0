import React, { FC } from "react";
import { Contact } from "../../../Domain/Contact";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { getCoreRowModel, ColumnDef, flexRender, useReactTable } from "@tanstack/react-table";
import { ExtendedContact } from "../AllContactsSidePage";
import classNames from "classnames/bind";

import styles from "./AllContactsTable.less";

const CONTACTS_LIST_ROW_HEIGHT = 25;

const cn = classNames.bind(styles);

interface IAllContactsTableProps {
    contacts: ExtendedContact[];
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
    const columns: ColumnDef<ExtendedContact>[] = [
        {
            header: "Type",
            id: "type",
            accessorFn: (contact) => contact.type,
            maxSize: 95,
            minSize: 55,
        },
        {
            header: "Value",
            id: "value",
            accessorFn: (contact) => contact.value,
            maxSize: 270,
            minSize: 55,
        },
        {
            header: "ID",
            id: "id",
            accessorFn: (contact) => contact.id,
            maxSize: 280,
            minSize: 55,
        },

        {
            header: "Name",
            id: "name",
            accessorFn: (contact) => contact.name,
            minSize: 55,
            maxSize: 200,
        },
        {
            header: "User or TeamID",
            id: "user",
            accessorFn: (contact) => contact.user || contact.team,
            minSize: 105,
        },
    ];

    const table = useReactTable({
        data: contacts,
        columns,
        enableColumnResizing: true,
        columnResizeMode: "onChange",
        getCoreRowModel: getCoreRowModel(),
    });

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
                                width: header.getSize(),
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

            <AutoSizer disableWidth>
                {({ height }) => {
                    return (
                        <List
                            height={height}
                            itemCount={table.getRowModel().rows.length}
                            itemSize={CONTACTS_LIST_ROW_HEIGHT}
                            width="100%"
                        >
                            {({ index, style }) => {
                                const row = table.getRowModel().rows[index];
                                const contact = row.original;
                                return (
                                    <div
                                        key={row.id}
                                        className={cn("contacts-row", "clickable", {
                                            contactIsUnused: contact.isUnused,
                                        })}
                                        style={style}
                                        onClick={() => handleSetEditableContact(contact)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <div
                                                key={cell.id}
                                                className={cn("cell")}
                                                style={{
                                                    width: cell.column.getSize(),
                                                }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                );
                            }}
                        </List>
                    );
                }}
            </AutoSizer>
        </>
    );
};
