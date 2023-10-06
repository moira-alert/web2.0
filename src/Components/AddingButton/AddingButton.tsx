import * as React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./AddingButton.less";

const cn = classNames.bind(styles);

interface IAddingButtonProps {
    to: string;
}

export default function AddingButton(props: IAddingButtonProps): React.ReactElement {
    const { to } = props;
    return (
        <Link to={to} className={cn("button")} data-tid="Add Trigger">
            Add Trigger
        </Link>
    );
}
