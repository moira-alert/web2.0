// @flow
import React from "react";
import { saveAs } from "file-saver";
import { Button } from "@skbkontur/react-ui/components/Button";
import ExportIcon from "@skbkontur/react-icons/Export";

type FileExportProps = {
    title: string,
    data: string | object,
    children?: React.Node,
};

export default function FileExport({ title, data, children }: FileExportProps) {
    const handleExport = () => {
        const fileData = typeof data === "string" ? data : JSON.stringify(data, undefined, 4);
        const blob = new Blob([fileData], { type: "application/json" });
        saveAs(blob, `${title}.json`);
    };

    return (
        <Button use="link" onClick={handleExport} icon={<ExportIcon />}>
            {children || "Export"}
        </Button>
    );
}
