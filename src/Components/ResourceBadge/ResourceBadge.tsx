import React, { ReactElement } from "react";
import { Toast } from "@skbkontur/react-ui/components/Toast";
import CopyIcon from "@skbkontur/react-icons/Copy";
import cn from "./ResourceBadge.less";

interface EditorIdProps {
    title: string;
    id: string;
}

export function ResourceBadge(props: EditorIdProps): ReactElement {
    const handleClick = (): void => {
        navigator.clipboard.writeText(props.id);
        Toast.push("Copied to clipboard");
    };

    return (
        <div className={cn.wrapper}>
            <div className={cn.title}>{props.title}</div>
            <div>
                <span className={cn.icon} onClick={handleClick}>
                    <CopyIcon />
                </span>
                {props.id}
            </div>
        </div>
    );
}
