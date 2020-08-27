import React from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import ImportIcon from "@skbkontur/react-icons/Import";
import cn from "./FileLoader.less";

type FileLoaderProps = {
    onLoad: (fileData: string | ArrayBuffer | null, fileName: string) => void;
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
        reader.onload = () => onLoad(reader.result, file.name);
        reader.onerror = () => onError && onError(reader.error);
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
