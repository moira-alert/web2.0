import React, { FC } from "react";
import { ColumnDef, CellContext, Row, Column } from "@tanstack/react-table";
import { Status } from "../../../Domain/Status";
import { format, fromUnixTime } from "date-fns";
import StatusIndicator from "../../StatusIndicator/StatusIndicator";
import ArrowBoldRightIcon from "@skbkontur/react-icons/ArrowBoldRight";
import TrashIcon from "@skbkontur/react-icons/Trash";
import OkIcon from "@skbkontur/react-icons/Ok";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import { checkHasAllStatesForValues } from "../../../helpers/notificationFilters";
import { Link } from "@skbkontur/react-ui/components/Link";
import { getPageLink } from "../../../Domain/Global";
import { TeamNameTooltip } from "../../SubscriptionList/TeamNameTooltip";
import ContactTypeIcon from "../../ContactTypeIcon/ContactTypeIcon";
import { NotificationStateFiltersPanel } from "../../NotificationFiltersPanel/NotificationStateFiltersPanel";
import { ClusterKeyDropdownSelect } from "../../ClusterKeyDropdownSelect/СlusterKeyDropdownSelect";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import { Input } from "@skbkontur/react-ui/components/Input";
import { INotificationRow } from "../hooks/useNotificationColumns";
import classNames from "classnames/bind";

import styles from "../NotificationList.module.less";

const cn = classNames.bind(styles);

interface INotificationRowState {
    prev: Status[];
    curr: Status[];
}

export const createTimestampColumn = (): ColumnDef<INotificationRow> => ({
    header: "Timestamp",
    accessorKey: "timestamp",
    size: 80,
    minSize: 70,
    cell: TimestampCell,
});

const TimestampCell = ({ row }: CellContext<INotificationRow, unknown>) => {
    const { timestamp, count } = row.original;
    return (
        <>
            {format(fromUnixTime(timestamp), "MMMM d, HH:mm:ss")}
            {count > 1 ? ` (${count}×)` : ""}
        </>
    );
};

interface IStateFilter {
    prev?: Status[];
    curr?: Status[];
    strict?: boolean;
}

export const createStateColumn = (
    allCurrentStates: Status[],
    allPrevStates: Status[]
): ColumnDef<INotificationRow> => ({
    header: ({ column }) => {
        const filterValue = column.getFilterValue() as IStateFilter;

        return (
            <Tooltip
                trigger="click"
                pos="top left"
                render={() => (
                    <NotificationStateFiltersPanel
                        allCurrentStates={allCurrentStates}
                        allPrevStates={allPrevStates}
                        prevStateFilter={filterValue?.prev ?? []}
                        currentStateFilter={filterValue?.curr ?? []}
                        isStrictMatching={filterValue?.strict ?? false}
                        onChangePrev={(v) =>
                            column.setFilterValue((old: IStateFilter) => ({ ...old, prev: v }))
                        }
                        onChangeCurr={(v) =>
                            column.setFilterValue((old: IStateFilter) => ({ ...old, curr: v }))
                        }
                        onToggleStrict={(v) =>
                            column.setFilterValue((old: IStateFilter) => ({ ...old, strict: v }))
                        }
                    />
                )}
            >
                <span
                    className={cn("stateHead", {
                        active: !!(filterValue?.prev?.length || filterValue?.curr?.length),
                    })}
                >
                    State
                </span>
            </Tooltip>
        );
    },
    accessorKey: "state",
    size: 20,
    enableColumnFilter: true,
    cell: SatateCell,
    filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;

        const { prev = [], curr = [], strict = false } = filterValue;
        const value = row.getValue<INotificationRowState>(columnId);

        const matchPrev = checkHasAllStatesForValues(strict, prev, value.prev);
        const matchCurr = checkHasAllStatesForValues(strict, curr, value.curr);

        return matchPrev && matchCurr;
    },
});

const SatateCell = ({ row }: CellContext<INotificationRow, unknown>) => {
    const { prev, curr } = row.original.state;
    return (
        <div className={styles.state}>
            <div className={styles["prev-state"]}>
                <StatusIndicator statuses={prev} size={14} />
            </div>
            <div className={styles.arrow}>
                <ArrowBoldRightIcon />
            </div>
            <div className={styles["curr-state"]}>
                <StatusIndicator statuses={curr} size={14} />
            </div>
        </div>
    );
};

export const createTriggerColumn = (): ColumnDef<INotificationRow> => ({
    header: ({ column }) => <FilterInput placeholder="Trigger" column={column} />,
    accessorKey: "trigger",
    enableColumnFilter: true,
    size: 200,
    cell: TriggerCell,
    filterFn: (row, _columnId, filterValue) => {
        const name = row.original.trigger?.name?.toLowerCase() ?? "";
        return name.includes(filterValue.toLowerCase());
    },
});

const TriggerCell = ({ row }: CellContext<INotificationRow, unknown>) => {
    const { id, name } = row.original.trigger;
    return (
        <>
            {id ? (
                <Link className={styles.trigger} target="blank" href={getPageLink("trigger", id)}>
                    {name}
                </Link>
            ) : (
                <span>&mdash;</span>
            )}
        </>
    );
};

export const createOwnerColumn = (): ColumnDef<INotificationRow> => ({
    header: ({ column }) => <FilterInput placeholder="User or Team ID" column={column} />,
    accessorKey: "user",
    enableColumnFilter: true,
    size: 200,
    cell: OwnerCell,
    filterFn: (row, _columnId, filterValue) => {
        const { user, team } = row.original;
        return (user || team).toLowerCase().includes(filterValue.toLowerCase());
    },
});

const OwnerCell = ({ row }: CellContext<INotificationRow, unknown>) => {
    const { user, team } = row.original;
    return <>{user || <TeamNameTooltip className={styles.owner} target="blank" teamId={team} />}</>;
};

export const createContactColumn = (): ColumnDef<INotificationRow> => ({
    header: ({ column }) => <FilterInput placeholder="Contact" column={column} />,
    accessorKey: "contact",
    enableColumnFilter: true,
    size: 200,
    cell: ContactCell,
    filterFn: (row, _columnId, filterValue) => {
        const { name, value } = row.original.contact ?? {};
        const lower = filterValue.toLowerCase();

        return (
            (name?.toLowerCase().includes(lower) ?? false) || value.toLowerCase().includes(lower)
        );
    },
});

const ContactCell = ({ row }: CellContext<INotificationRow, unknown>) => {
    const { type, value, name } = row.original.contact;
    return (
        <div className={styles.contact}>
            <div className={styles["contact-name"]}>
                <ContactTypeIcon type={type} />
                &nbsp;
                {value}
                &nbsp;
                {name && `(${name})`}
            </div>
        </div>
    );
};

export const createThrottledColumn = (): ColumnDef<INotificationRow> => ({
    header: "Throttled",
    accessorKey: "throttled",
    size: 20,
    enableResizing: false,
    cell: ThrottledCell,
    filterFn: (row, _columnId, filterValue) => {
        const { name, value } = row.original.contact ?? {};
        const lower = filterValue.toLowerCase();

        return (
            (name?.toLowerCase().includes(lower) ?? false) || value.toLowerCase().includes(lower)
        );
    },
});

const ThrottledCell = ({ getValue }: CellContext<INotificationRow, unknown>) => {
    const value = getValue<boolean>();
    return (
        <div className={cn("throttled", { true: value, false: !value })}>
            {value ? <OkIcon /> : <DeleteIcon />}
        </div>
    );
};

export const createClusterKeyColumn = (allClusterKeys: string[]): ColumnDef<INotificationRow> => ({
    header: ({ column }) => {
        const selectedClusterKeys = (column.getFilterValue() as string[]) ?? [];

        return (
            <ClusterKeyDropdownSelect
                width={130}
                clusterKeys={allClusterKeys}
                selectedClusterKeys={selectedClusterKeys}
                onToggleCluster={(key, checked) => {
                    const current = selectedClusterKeys;
                    const newSelected = checked
                        ? [...current, key]
                        : current.filter((k) => k !== key);

                    column.setFilterValue(newSelected);
                }}
                onToggleAll={(checked) => {
                    column.setFilterValue(checked ? [] : allClusterKeys);
                }}
            />
        );
    },
    accessorKey: "clusterKey",
    size: 120,
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue: string[]) => {
        if (!filterValue?.length) return true;
        return filterValue.includes(row.original.clusterKey);
    },
});

export const createFailsColumn = (): ColumnDef<INotificationRow> => ({
    header: "Fails",
    accessorKey: "fails",
    size: 20,
    enableResizing: false,
});

export const createActionsColumn = (
    handleClickRemoveBtn: (id: string) => void
): ColumnDef<INotificationRow> => ({
    header: "",
    id: "remove",
    size: 10,
    enableResizing: false,
    cell: ({ row }) => <ActionsCell row={row} onRemove={handleClickRemoveBtn} />,
});

const ActionsCell: FC<{
    row: Row<INotificationRow>;
    onRemove: (id: string) => void;
}> = ({ row, onRemove }) => (
    <Button
        size="large"
        use="link"
        icon={<TrashIcon />}
        onClick={() => onRemove(row.original.id)}
    />
);

interface FilterInputProps {
    placeholder: string;
    column: Column<INotificationRow, unknown>;
}

const FilterInput: React.FC<FilterInputProps> = ({ placeholder, column }) => {
    return (
        <div className={styles.filterInput}>
            <Input
                showClearIcon="always"
                placeholder={placeholder}
                onValueChange={column.setFilterValue}
                value={(column.getFilterValue() ?? "") as string}
            />
        </div>
    );
};
