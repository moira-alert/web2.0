import React from "react";
import { saveAs } from "file-saver";
import { Subscription } from "../../Domain/Subscription";
import { Contact } from "../../Domain/Contact";
import { Trigger } from "../../Domain/Trigger";

type FileExportProps = {
    title: string;
    data: Partial<Trigger | Subscription | Contact>;
    children?: React.ReactNode;
};

export default function FileExport({ title, data, children }: FileExportProps): React.ReactElement {
    const handleExport = () => {
        const fileData = JSON.stringify(data, undefined, 4);
        const blob = new Blob([fileData], { type: "application/json" });
        saveAs(blob, `${title}.json`);
    };

    return <span onClick={handleExport}>{children || "Export"}</span>;
}
