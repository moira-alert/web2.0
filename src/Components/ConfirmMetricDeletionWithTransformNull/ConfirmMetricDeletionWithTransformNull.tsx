import { FC } from "react";
import { Confirm } from "../Teams/Confirm";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { Button } from "@skbkontur/react-ui";
import { IconTrashCanRegular16 } from "@skbkontur/icons/IconTrashCanRegular16";
import CodeRef from "../CodeRef/CodeRef";
import styles from "./ConfirmMetricDeletionWithTransformNull.module.less";

interface IConfirmMetricDeletionWithTransformNull {
    action: () => void;
    deleteButtonText: string;
}

const ConfirmMetricDeletionWithTransformNullText = (
    <span>
        Removing metrics with a target that contains transformNull may cause false{" "}
        <CodeRef>NODATA</CodeRef> alerts.
    </span>
);

export const ConfirmMetricDeletionWithTransformNull: FC<
    IConfirmMetricDeletionWithTransformNull
> = ({ action, deleteButtonText }) => {
    const { isTransformNullApplied } = useAppSelector(UIState);

    return (
        <Confirm
            active={isTransformNullApplied}
            message={ConfirmMetricDeletionWithTransformNullText}
            width={280}
            action={action}
        >
            <Button className={styles.deleteButton} use="text" icon={<IconTrashCanRegular16 />}>
                {deleteButtonText}
            </Button>
        </Confirm>
    );
};
