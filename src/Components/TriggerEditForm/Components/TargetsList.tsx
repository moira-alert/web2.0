import React, { useEffect, FC } from "react";
import RemoveIcon from "@skbkontur/react-icons/Remove";
import AddIcon from "@skbkontur/react-icons/Add";
import { Checkbox, Button, Hint } from "@skbkontur/react-ui";
import { RowStack, Fill, Fit } from "@skbkontur/react-stack-layout";
import HighlightInput from "../../HighlightInput/HighlightInput";
import { CopyButton } from "./CopyButton";
import { useIds } from "../../../hooks/useIds";
import { v4 as uuidv4 } from "uuid";
import TriggerSource, { Trigger, ValidateTriggerResult } from "../../../Domain/Trigger";
import classNames from "classnames/bind";

import styles from "../TriggerEditForm.less";

const cn = classNames.bind(styles);

interface IProps {
    targets: Array<string>;
    alone_metrics: {
        [target_id: string]: boolean;
    };
    trigger_source: TriggerSource;
    validationResult?: ValidateTriggerResult;
    onChange: (trigger: Partial<Trigger>, targetIndex?: number) => void;
}

export const TargetsList: FC<IProps> = ({
    targets,
    alone_metrics: aloneMetrics,
    trigger_source: triggerSource,
    validationResult,
    onChange,
}) => {
    const [ids, setIds] = useIds(targets?.length || 0);

    const targetsRef = React.useRef(targets);
    const idsRef = React.useRef(ids);

    const handleUpdateAloneMetrics = (targetIndex: number, value: boolean): void => {
        const target = `t${targetIndex + 1}`;

        if (aloneMetrics === null) {
            aloneMetrics = {};
        }

        aloneMetrics[target] = value;
        onChange({
            alone_metrics: aloneMetrics,
        });
    };

    const handleRemoveTarget = (targetIndex: number): void => {
        const aloneMetricsIndex = targets?.map((_, i) => aloneMetrics?.[`t${i + 1}`]) ?? [];

        const newAloneMetricsIndex = aloneMetricsIndex.filter((_, i) => i !== targetIndex);

        const newAloneMetrics = newAloneMetricsIndex.reduce(
            (acc, item, index) => ({ ...acc, [`t${index + 1}`]: item }),
            {} as Record<string, boolean>
        );

        onChange({
            targets: [
                ...(targets?.slice(0, targetIndex) ?? []),
                ...(targets?.slice(targetIndex + 1) ?? []),
            ],
            alone_metrics: newAloneMetrics,
        });

        setIds((prevIds) => {
            const newIds = [...prevIds];
            newIds.splice(targetIndex, 1);
            return newIds;
        });
    };

    const handleAddTarget = (): void => {
        onChange({
            trigger_type: "expression",
            targets: [...targetsRef.current, ""],
        });
        const newId = uuidv4();
        setIds((prevIds) => [...prevIds, newId]);
    };

    const handleUpdateTarget = (targetId: string, value: string): void => {
        const index = idsRef.current.findIndex((el) => targetId === el);
        onChange({
            targets: [
                ...targetsRef.current.slice(0, index),
                value,
                ...targetsRef.current.slice(index + 1),
            ],
        });
    };

    useEffect(() => {
        targetsRef.current = targets;
        idsRef.current = ids;
    }, [targets, ids]);

    return (
        <>
            {targets.map((target, i) => {
                return (
                    <div key={ids[i]} className={cn("target")}>
                        <RowStack block verticalAlign="top" gap={1}>
                            <span className={cn("target-number")}>T{i + 1}</span>
                            <Fill>
                                <HighlightInput
                                    triggerSource={triggerSource}
                                    value={target}
                                    onValueChange={(value: string) => {
                                        handleUpdateTarget(ids[i], value);
                                    }}
                                    validate={validationResult?.targets?.[i]}
                                />
                            </Fill>

                            {targets.length > 1 && (
                                <Fit>
                                    <Checkbox
                                        checked={aloneMetrics[`t${i + 1}`]}
                                        onValueChange={(value) =>
                                            handleUpdateAloneMetrics(i, value)
                                        }
                                        data-tid={`Target Single ${i + 1}`}
                                    >
                                        Single
                                    </Checkbox>
                                </Fit>
                            )}
                            {targets.length > 1 && (
                                <Fit>
                                    <Button
                                        icon={<RemoveIcon />}
                                        onClick={() => handleRemoveTarget(i)}
                                        data-tid="Target Remove"
                                    ></Button>
                                </Fit>
                            )}
                        </RowStack>
                        <Hint text="Copy without formatting">
                            <CopyButton className={cn("copyButton")} value={target} />
                        </Hint>
                    </div>
                );
            })}
            <Button use="link" icon={<AddIcon />} onClick={handleAddTarget}>
                Add one more
            </Button>
        </>
    );
};
