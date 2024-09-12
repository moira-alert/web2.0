import React from "react";
import { Button, Toast } from "@skbkontur/react-ui";
import CopyIcon from "@skbkontur/react-icons/Copy";

interface IProps {
    value: string;
    className?: string;
}

const copy = (text: string) => {
    if (navigator.clipboard) {
        // If clipboard api is supported
        navigator.clipboard
            .writeText(text)
            .then(() => {
                console.log("Text copied to clipboard");
            })
            .catch((err) => {
                console.error("Failed to copy text", err);
            });
    } else {
        // Fallback on execCommand
        const textarea = Object.assign(document.createElement("textarea"), {
            value: text,
            style: { position: "absolute", left: "-9999px" },
        });
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand("copy");
            console.log("Text copied to clipboard");
        } catch (err) {
            console.error("Failed to copy text", err);
        }

        document.body.removeChild(textarea);
    }
};

export const CopyButton: React.FC<IProps> = ({ value, className }) => {
    const handleCopy = () => {
        Toast.push("Target value copied");
        copy(value.trim());
    };

    return <Button className={className} use="link" icon={<CopyIcon />} onClick={handleCopy} />;
};
