import React, { FC } from "react";
import { Confirm } from "../Teams/Confirm";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { Button } from "@skbkontur/react-ui";
import TrashIcon from "@skbkontur/react-icons/Trash";

interface IConfirmMetricDeletionWithTransformNull {
    action: () => void;
    deleteButtonText: string;
}

const ConfirmMetricDeletionWithTransformNullText = (
    <span>
        This change may result in the deletion of the entire <strong>moira-pattern-metrics</strong>{" "}
        key, potentially disrupting <strong>transformNull</strong> functionality for other metrics.
    </span>
);

export const ConfirmMetricDeletionWithTransformNull: FC<IConfirmMetricDeletionWithTransformNull> = ({
    action,
    deleteButtonText,
}) => {
    const { isTransformNullApplied } = useAppSelector(UIState);

    return (
        <Confirm
            active={isTransformNullApplied}
            message={ConfirmMetricDeletionWithTransformNullText}
            width={300}
            action={action}
        >
            <Button use="link" icon={<TrashIcon />}>
                {deleteButtonText}
            </Button>
        </Confirm>
    );
};
