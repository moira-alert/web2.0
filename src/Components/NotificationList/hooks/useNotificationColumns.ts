import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Contact } from "../../../Domain/Contact";
import { Status } from "../../../Domain/Status";
import { MoiraTriggerData } from "../../../Domain/__generated__/data-contracts";
import {
    createActionsColumn,
    createClusterKeyColumn,
    createContactColumn,
    createFailsColumn,
    createOwnerColumn,
    createStateColumn,
    createThrottledColumn,
    createTimestampColumn,
    createTriggerColumn,
} from "../Components/Columns";

interface INotificationRowState {
    prev: Status[];
    curr: Status[];
}

export interface INotificationRow {
    id: string;
    timestamp: number;
    state: INotificationRowState;
    trigger: MoiraTriggerData;
    user: string;
    team: string;
    contact: Contact;
    throttled: boolean;
    fails: number;
    clusterKey: string;
    count: number;
}

interface INotificationColumnsProps {
    allCurrentStates: Status[];
    allPrevStates: Status[];
    allClusterKeys: string[];
    handleClickActionsBtn: (id: string) => void;
}

export const useNotificationColumns = ({
    allCurrentStates,
    allPrevStates,
    allClusterKeys,
    handleClickActionsBtn,
}: INotificationColumnsProps) =>
    useMemo<ColumnDef<INotificationRow>[]>(
        () => [
            createTimestampColumn(),
            createStateColumn(allCurrentStates, allPrevStates),
            createTriggerColumn(),
            createOwnerColumn(),
            createContactColumn(),
            createThrottledColumn(),
            createFailsColumn(),
            createClusterKeyColumn(allClusterKeys),
            createActionsColumn(handleClickActionsBtn),
        ],
        []
    );
