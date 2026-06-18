import { ReactElement } from "react";
import { SingleToast } from "@skbkontur/react-ui";
import { IconCopyRegular16 } from "@skbkontur/icons/IconCopyRegular16";
import cn from "./ResourceBadge.module.less";

interface EditorIdProps {
    title: string;
    id: string;
}

export function ResourceBadge(props: EditorIdProps): ReactElement {
    const handleClick = (): void => {
        navigator.clipboard.writeText(props.id);
        SingleToast.push("Copied to clipboard");
    };

    return (
        <div className={cn.wrapper}>
            <div className={cn.title}>{props.title}</div>
            <div>
                <span className={cn.icon} onClick={handleClick}>
                    <IconCopyRegular16 />
                </span>
                {props.id}
            </div>
        </div>
    );
}
