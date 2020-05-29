// @flow

import * as React from "react";
import roundValue from "../../helpers/roundValue";

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
                    <b>{key}:</b> {roundValue(values[key])}
                </div>
            ))}
        </div>
    );
}
