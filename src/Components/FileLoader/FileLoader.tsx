import React from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import ImportIcon from "@skbkontur/react-icons/Import";
import classNames from "classnames/bind";

import styles from "./FileLoader.less";

const cn = classNames.bind(styles);

type FileLoaderProps = {
    onLoad: (fileData: string, fileName: string) => void;
    onError?: (error: DOMException | null) => void;
    children?: React.ReactNode;
};

export default function FileLoader({
    onLoad,
    onError,
    children,
}: FileLoaderProps): React.ReactElement {
    const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            if (typeof reader.result === "string") {
                onLoad(reader.result, file.name);
            }
        };
        reader.onerror = () => onError && onError(reader.error);
        // enable import same file
        event.target.value = "";
    };

    return (
        <Button use="link">
            <label className={cn.label}>
                <input type="file" className={cn.input} onChange={handleFileLoad} accept=".json" />
                <ImportIcon /> {children || "Import"}
            </label>
        </Button>
    );
}
