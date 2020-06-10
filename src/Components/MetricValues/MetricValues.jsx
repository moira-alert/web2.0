// @flow

import * as React from "react";
import roundValue from "../../helpers/roundValue";

type Props = {|
    values?: {
        [metric: string]: number,
    },
    value?: number,
    placeholder: boolean,
|};

export default function MetricValues(props: Props): React.Node {
    const { value, values, placeholder } = props;
    if (values === undefined) {
        return <div>{roundValue(value, placeholder)}</div>;
    }
    const arr = Object.keys(values).map(key => values[key]);
    if (arr.length === 1) {
        return <div>{roundValue(arr[0], placeholder)}</div>;
    }
    return (
        <div>
            {arr.map((val, i) => (
                <div>
                    <b>T{i + 1}:</b> {roundValue(val)}
                </div>
            ))}
        </div>
    );
}
