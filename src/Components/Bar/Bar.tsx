import * as React from "react";
import WarningIcon from "@skbkontur/react-icons/Warning";
import cn from "./Bar.less";

type Props = {
    message: string;
};

export default function Bar(props: Props): React.ReactNode {
    const { message } = props;
    return (
        <div className={cn("bar")}>
            <WarningIcon /> {message}
        </div>
    );
}
