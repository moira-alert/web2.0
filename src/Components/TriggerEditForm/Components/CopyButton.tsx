import type { FC } from "react";
import { Hint, SingleToast } from "@skbkontur/react-ui";
import { IconCopyRegular16 } from "@skbkontur/icons/IconCopyRegular16";
import classNames from "classnames/bind";

import styles from "./CopyButton.module.less";

const cn = classNames.bind(styles);

interface IProps {
    value: string;
    className?: string;
    hintMessage?: string;
}

const pushSuccessfulMessage = () => SingleToast.push("Text copied to clipboard");

const copy = async (text: string) => {
    if (navigator?.clipboard) {
        try {
            await navigator.clipboard.writeText(text);
            pushSuccessfulMessage();
        } catch (error) {
            console.error(error);
            SingleToast.push("Failed to copy text");
        }
    } else {
        // Fallback on execCommand
        const textarea = Object.assign(document.createElement("textarea"), {
            value: text,
            style: { position: "absolute", left: "-9999px" },
        });
        document.body.appendChild(textarea);
        textarea.select();

        const isSuccessful = document.execCommand("copy");

        if (isSuccessful) {
            pushSuccessfulMessage();
        } else {
            SingleToast.push("Failed to copy text, try to launch the app under https");
        }

        document.body.removeChild(textarea);
    }
};

export const CopyButton: FC<IProps> = ({ value, className, hintMessage }) => {
    const handleCopy = async () => {
        await copy(value.trim());
    };

    return (
        <Hint text={hintMessage}>
            <IconCopyRegular16 className={cn("copyIcon", className)} onClick={handleCopy} />
        </Hint>
    );
};
