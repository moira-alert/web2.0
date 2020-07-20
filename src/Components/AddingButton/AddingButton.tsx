import * as React from "react";
import { Link } from "react-router-dom";
import cn from "./AddingButton.less";

type Props = {
    to: string,
};

export default function AddingButton(props: Props): React.ReactNode {
    const { to } = props;
    return (
        <Link to={to} className={cn("button")}>
            Add Trigger
        </Link>
    );
}
