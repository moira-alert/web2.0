import * as React from "react";
import { Toggle } from "@skbkontur/react-ui/components/Toggle";
import cn from "./Toggle.less";

type Props = {
    checked?: boolean;
    label: string;
    onChange: (checked: boolean) => void | Promise<void>;
};

export default function ToggleWithLabel(props: Props): React.ReactElement {
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
