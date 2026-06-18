import { useState, useMemo, useEffect } from "react";
import { Notification } from "../../Domain/Notification";
import { ConfirmModalHeaderData } from "../../Domain/Global";
import useConfirmModal, { ConfirmModal } from "../../hooks/useConfirmModal";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
    useReactTable,
    type Row,
} from "@tanstack/react-table";
import { List } from "react-window";
import type { RowComponentProps } from "react-window";
import { INotificationRow } from "./hooks/useNotificationColumns";
import { useAppDispatch } from "../../store/hooks";
import { setFilteredCount } from "../../store/Reducers/NotificationFilters.slice";
import { useNotificationData } from "./hooks/useNotificationData";
import classNames from "classnames/bind";

import styles from "./NotificationList.module.less";

const cn = classNames.bind(styles);

export type TNotificationListProps = {
    items: {
        [id: string]: Array<Notification>;
    };
    onRemove: (key: string) => void;
};

const ROW_HEIGHT = 50;
const MAX_LIST_HEIGHT = 1000;

interface NotificationRowProps {
    rows: Row<INotificationRow>[];
    columnSizing: Record<string, number>;
}

const RowComponent = ({ index, style, rows }: RowComponentProps<NotificationRowProps>) => {
    const row = rows[index];
    return (
        <div style={style} key={row.id} className={cn("row")}>
            {row.getVisibleCells().map((cell) => (
                <div
                    key={cell.id}
                    className={cn("cell")}
                    style={{
                        width: cell.column.getSize(),
                        flex: `1 1 ${cell.column.getSize()}px`,
                    }}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
            ))}
        </div>
    );
};

export default function NotificationList({ items, onRemove }: TNotificationListProps) {
    const { modalData, setModalData, closeModal } = useConfirmModal();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const dispatch = useAppDispatch();

    const handleClickRemoveBtn = (id: string) => {
        setModalData({
            isOpen: true,
            header: ConfirmModalHeaderData.deleteNotification,
            button: {
                text: "Delete",
                use: "danger",
                onConfirm: () => handleDelete(id),
            },
        });
    };

    const { data, columns } = useNotificationData({
        items,
        handleClickActionsBtn: handleClickRemoveBtn,
    });

    const handleDelete = (id: string) => {
        setModalData({ isOpen: false });
        onRemove(id);
    };

    const table = useReactTable({
        data,
        columns,
        enableColumnResizing: true,
        columnResizeMode: "onChange",
        columnResizeDirection: "ltr",
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const filteredRows = table.getFilteredRowModel().rows;
    const rows = table.getRowModel().rows;

    const filteredNotificationsCount = useMemo(() => {
        return filteredRows.reduce((total, row) => {
            return total + row.original.count;
        }, 0);
    }, [filteredRows]);

    useEffect(() => {
        dispatch(setFilteredCount(filteredNotificationsCount));
    }, [filteredNotificationsCount]);

    if (data.length === 0) {
        return <div className={cn("no-result")}>Empty :-)</div>;
    }

    const listHeight = Math.min(rows.length * ROW_HEIGHT, MAX_LIST_HEIGHT);
    const hasVerticalScroll = rows.length * ROW_HEIGHT > MAX_LIST_HEIGHT;

    const { columnSizing } = table.getState();

    return (
        <>
            <ConfirmModal modalData={modalData} closeModal={closeModal} />

            {table.getHeaderGroups().map((headerGroup) => (
                <div
                    style={{
                        paddingRight: hasVerticalScroll ? "17px" : "0",
                    }}
                    key={headerGroup.id}
                    className={cn("row", "italic-font", "header")}
                >
                    {headerGroup.headers.map((header) => (
                        <div
                            className={cn("header-group")}
                            key={header.id}
                            style={{
                                flex: `1 1 ${header.getSize()}px`,
                                width: header.column.getSize(),
                            }}
                        >
                            <div className={cn("cell")}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </div>

                            {header.column.getCanResize() && (
                                <div
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

            <List
                style={{ width: "100%", height: `${listHeight}px` }}
                rowComponent={RowComponent}
                rowCount={rows.length}
                rowHeight={ROW_HEIGHT}
                rowProps={{
                    rows,
                    columnSizing,
                }}
            />
        </>
    );
}
