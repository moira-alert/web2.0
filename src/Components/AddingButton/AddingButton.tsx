import * as React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../Themes";
import classNames from "classnames/bind";

import styles from "./AddingButton.less";

const cn = classNames.bind(styles);

interface IAddingButtonProps {
    to: string;
}

export default function AddingButton(props: IAddingButtonProps): React.ReactElement {
    const { to } = props;
    const theme = useTheme();
    return (
        <Link
            to={to}
            className={cn("button")}
            style={{
                color: theme.textColorDefault,
            }}
            data-tid="Add Trigger"
        >
            Add Trigger
        </Link>
    );
}
