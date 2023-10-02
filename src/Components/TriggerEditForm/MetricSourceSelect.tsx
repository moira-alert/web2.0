import React from "react";
import { Gapped, Radio, RadioGroup } from "@skbkontur/react-ui";
import TriggerSource from "../../Domain/Trigger";
import { Link } from "@skbkontur/react-ui/components/Link";

interface Props {
    triggerSource?: TriggerSource;
    onSourceChange: (value: TriggerSource) => void;
}

export const MetricSourceSelect: React.FC<Props> = ({ triggerSource, onSourceChange }) => {
    return (
        <RadioGroup<TriggerSource>
            name="data-source"
            defaultValue={triggerSource}
            onValueChange={onSourceChange}
        >
            <Gapped vertical gap={10}>
                <Radio value={TriggerSource.GRAPHITE_LOCAL}> Local (default)</Radio>
                <Radio value={TriggerSource.GRAPHITE_REMOTE}>
                    Graphite Remote. Be careful, it may cause{" "}
                    <Link href="http://moira.readthedocs.io/en/latest/user_guide/advanced.html#data-source">
                        extra load
                    </Link>
                </Radio>
                <Radio value={TriggerSource.PROMETHEUS_REMOTE}> Prometheus Remote </Radio>
            </Gapped>
        </RadioGroup>
    );
};
