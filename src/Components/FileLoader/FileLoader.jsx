// @flow
import React from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import ImportIcon from "@skbkontur/react-icons/Import";
import cn from "./FileLoader.less";

type FileLoaderProps = {
    onLoad: (string, string) => void,
    onError: string => void,
    children?: React.Node,
};

export default function FileLoader({ onLoad, onError, children }: FileLoaderProps) {
    const handleFileLoad = (event: SyntheticInputEvent<HTMLInputElement>) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => onLoad(reader.result, file.name);
        reader.onerror = () => onError(reader.error);
        // enable import same file
        // eslint-disable-next-line no-param-reassign
        event.target.value = "";
    };

    return (
        <Button use="link">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className={cn.label}>
                <input type="file" className={cn.input} onChange={handleFileLoad} accept=".json" />
                <ImportIcon /> {children || "Import"}
            </label>
        </Button>
    );
}
