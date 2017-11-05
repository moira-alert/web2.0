// @flow
import * as React from "react";
import { Link } from "react-router-dom";
import cn from "./AddingButton.less";

type Props = {|
    to: string,
|};

export default function AddingButton(props: Props): React.Node {
    return (
        <Link to={props.to} className={cn("button")}>
            Add Trigger
        </Link>
    );
}
