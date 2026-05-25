import type { ReactNode, ChangeEvent, ReactElement } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { IconArrowUiShareAImportRegular16 } from "@skbkontur/icons/IconArrowUiShareAImportRegular16";
import classNames from "classnames/bind";

import styles from "./FileLoader.module.less";

const cn = classNames.bind(styles);

type FileLoaderProps = {
    onLoad: (fileData: string, fileName: string) => void;
    onError?: (error: DOMException | null) => void;
    children?: ReactNode;
};

export default function FileLoader({ onLoad, onError, children }: FileLoaderProps): ReactElement {
    const handleFileLoad = (event: ChangeEvent<HTMLInputElement>) => {
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
        <Button use="text">
            <label className={cn("label")}>
                <input
                    type="file"
                    className={cn("input")}
                    onChange={handleFileLoad}
                    accept=".json"
                />
                <IconArrowUiShareAImportRegular16 /> {children || "Import"}
            </label>
        </Button>
    );
}
