// @flow
/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */
import * as React from "react";
import { Toggle } from "@skbkontur/react-ui";
import cn from "./Toggle.less";

type Props = {|
    checked?: boolean,
    label: string,
    onChange: (checked: boolean) => void | Promise<void>,
|};

export default function ToggleWithLabel(props: Props): React.Element<any> {
    const { checked, label, onChange } = props;
    return (
        <label className={cn("toggle")}>
            <Toggle
                checked={Boolean(checked)}
                onChange={() => {
                    onChange(!checked);
                }}
            />{" "}
            {label}
        </label>
    );
}
