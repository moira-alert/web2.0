import React from "react";
import { Button, Toast } from "@skbkontur/react-ui";
import CopyIcon from "@skbkontur/react-icons/Copy";

interface IProps {
    value: string;
    className?: string;
}

const copy = async (text: string) => {
    if (!navigator?.clipboard) {
        return;
    }
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        console.log(error);
    }
};

export const CopyButton: React.FC<IProps> = ({ value, className }) => {
    const handleCopy = () => {
        Toast.push("Target value copied");
        copy(value.trim());
    };

    return <Button className={className} use="link" icon={<CopyIcon />} onClick={handleCopy} />;
};
