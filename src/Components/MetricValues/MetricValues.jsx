// @flow

import * as React from "react";
import roundValue from "../../helpers/roundValue";
import cn from "./MetricValues.less";

type Props = {|
    values: {
        [metric: string]: number,
    },
    value: number,
    placeholder: boolean,
|};

export default function MetricValues(props: Props): React.Node {
    const { value, values, placeholder } = props;
    if (values === undefined) {
        return <div>{roundValue(value, placeholder)}</div>;
    }
    return (
        <div>
            {Object.keys(values).map(key => (
                <div>
                    <span className={cn("target-name")}>{key}:</span> {roundValue(values[key])}
                </div>
            ))}
        </div>
    );
}
