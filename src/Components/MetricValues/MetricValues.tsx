import * as React from "react";
import { roundValue } from "../../helpers/roundValue";

type Props = {
    values?: {
        [metric: string]: number;
    };
    placeholder: boolean;
    hideTargetsNames?: boolean;
};

export default function MetricValues(props: Props): React.ReactElement {
    const { values, placeholder, hideTargetsNames } = props;
    if (values === undefined) {
        return <div>{roundValue(values, placeholder)}</div>;
    }
    const arr = Object.keys(values).map((key) => {
        return {
            key,
            value: values[key],
        };
    });
    if (arr.length === 1 && hideTargetsNames) {
        return <div id="targetsNames">{roundValue(arr[0].value, placeholder)}</div>;
    }

    return (
        <div>
            {arr.map((val) => (
                <div key={val.key}>
                    <b>{val.key.toUpperCase()}:</b> {roundValue(val.value)}
                </div>
            ))}
        </div>
    );
}
