import React from "react";
import { Button, Toast } from "@skbkontur/react-ui";
import CopyIcon from "@skbkontur/react-icons/Copy";

interface IProps {
    value: string;
    className?: string;
}

const pusfSuccessfulMessage = () => Toast.push("Text copied to clipboard");

const copy = async (text: string) => {
    if (navigator?.clipboard) {
        try {
            await navigator.clipboard.writeText(text);
            pusfSuccessfulMessage();
        } catch (error) {
            console.error(error);
            Toast.push("Failed to copy text");
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

        isSuccessful
            ? pusfSuccessfulMessage()
            : Toast.push("Failed to copy text, try to launch the app under https");

        document.body.removeChild(textarea);
    }
};

export const CopyButton: React.FC<IProps> = ({ value, className }) => {
    const handleCopy = async () => {
        await copy(value.trim());
    };

    return <Button className={className} use="link" icon={<CopyIcon />} onClick={handleCopy} />;
};
