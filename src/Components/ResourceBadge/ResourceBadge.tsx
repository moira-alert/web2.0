import { ReactElement } from "react";
import { Toast } from "@skbkontur/react-ui/components/Toast";
import { IconCopyRegular16 } from "@skbkontur/icons/IconCopyRegular16";
import cn from "./ResourceBadge.module.less";

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
                    <IconCopyRegular16 />
                </span>
                {props.id}
            </div>
        </div>
    );
}
