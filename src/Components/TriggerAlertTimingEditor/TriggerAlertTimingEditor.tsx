import { FC } from "react";
import { tooltip, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import { Status } from "../../Domain/Status";
import { Trigger } from "../../Domain/Trigger";
import { ColumnStack, Fit, Fixed, RowStack } from "../ItemsStack/ItemsStack";
import FormattedNumberInput from "../FormattedNumberInput/FormattedNumberInput";
import StatusIcon from "../StatusIcon/StatusIcon";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import { validateForDuration } from "../TriggerEditForm/Validations/validations";
import { defaultNumberEditFormat, defaultNumberViewFormat } from "../../helpers/Formats";
import classNames from "classnames/bind";

import styles from "./TriggerAlertTimingEditor.module.less";

const cn = classNames.bind(styles);

type Props = {
    warnFor: number | null;
    errorFor: number | null;
    warnKeepFiringFor: number | null;
    errorKeepFiringFor: number | null;
    onChange: (update: Partial<Trigger>) => void;
};

const durationInput = (
    value: number | null,
    onValueChange: (value: number | null) => void,
    tid: string
) => (
    <ValidationWrapperV1
        renderMessage={tooltip("right middle")}
        validationInfo={validateForDuration(value)}
    >
        <FormattedNumberInput
            width={90}
            editFormat={defaultNumberEditFormat}
            viewFormat={defaultNumberViewFormat}
            value={value}
            onValueChange={onValueChange}
            data-tid={tid}
        />
    </ValidationWrapperV1>
);

export const TriggerAlertTimingEditor: FC<Props> = ({
    warnFor,
    errorFor,
    warnKeepFiringFor,
    errorKeepFiringFor,
    onChange,
}) => {
    const row = (
        status: Status.WARN | Status.ERROR,
        forValue: number | null,
        keepValue: number | null,
        forKey: keyof Trigger,
        keepKey: keyof Trigger
    ) => (
        <Fit>
            <RowStack block baseline gap={2}>
                <Fit>
                    <StatusIcon status={status} />
                </Fit>
                <Fixed width={54} className={cn("caption")}>
                    {status}
                </Fixed>
                <Fit>fire after</Fit>
                <Fit>{durationInput(forValue, (v) => onChange({ [forKey]: v ?? 0 }), `${status} for`)}</Fit>
                <Fit>s, keep firing</Fit>
                <Fit>
                    {durationInput(keepValue, (v) => onChange({ [keepKey]: v ?? 0 }), `${status} keep firing`)}
                </Fit>
                <Fit>s</Fit>
            </RowStack>
        </Fit>
    );

    return (
        <ColumnStack block gap={2} stretch>
            <Fit>
                <span className={cn("title")}>Alert timing (optional)</span>
                <HelpTooltip>
                    <div className={cn("help")}>
                        <p>
                            <b>fire after</b> — the metric must stay over the threshold this many
                            seconds before the alert fires (0 = immediately).
                        </p>
                        <p>
                            <b>keep firing</b> — the alert stays active this many seconds after the
                            metric returns to normal.
                        </p>
                    </div>
                </HelpTooltip>
            </Fit>
            {row(Status.WARN, warnFor, warnKeepFiringFor, "warn_for", "warn_keep_firing_for")}
            {row(Status.ERROR, errorFor, errorKeepFiringFor, "error_for", "error_keep_firing_for")}
        </ColumnStack>
    );
};

export default TriggerAlertTimingEditor;
