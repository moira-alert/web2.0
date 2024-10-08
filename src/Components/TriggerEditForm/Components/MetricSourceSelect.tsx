import React from "react";
import { Radio, RadioGroup } from "@skbkontur/react-ui";
import TriggerSource from "../../../Domain/Trigger";
import { Link } from "@skbkontur/react-ui/components/Link";
import { Flexbox } from "../../Flexbox/FlexBox";

interface Props {
    triggerSource?: TriggerSource;
    onSourceChange: (value: TriggerSource) => void;
}

const remoteTriggerLink =
    "http://moira.readthedocs.io/en/latest/user_guide/advanced.html#data-source";

export const MetricSourceSelect: React.FC<Props> = ({ triggerSource, onSourceChange }) => {
    return (
        <RadioGroup<TriggerSource>
            name="data-source"
            defaultValue={triggerSource}
            onValueChange={onSourceChange}
        >
            <Flexbox gap={10}>
                <Radio data-tid="Graphite local" value={TriggerSource.GRAPHITE_LOCAL}>
                    Local (default)
                </Radio>
                <Radio data-tid="Graphite remote" value={TriggerSource.GRAPHITE_REMOTE}>
                    Graphite Remote. Be careful, it may cause&nbsp;
                    <Link href={remoteTriggerLink}>extra load</Link>
                </Radio>
                <Radio data-tid="Prometheus remote" value={TriggerSource.PROMETHEUS_REMOTE}>
                    Prometheus Remote
                </Radio>
            </Flexbox>
        </RadioGroup>
    );
};
