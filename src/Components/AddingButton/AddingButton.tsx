import * as React from "react";
import { Link } from "react-router-dom";
import cn from "./AddingButton.less";

interface IAddingButtonProps {
    to: string;
}

export default function AddingButton(props: IAddingButtonProps): React.ReactNode {
    const { to } = props;
    return (
        <Link to={to} className={cn("button")}>
            Add Trigger
        </Link>
    );
}
