import type { ReactNode, ReactElement } from "react";
import { saveAs } from "file-saver";
import { Button } from "@skbkontur/react-ui/components/Button";
import { IconArrowUiShareAExportRegular16 } from "@skbkontur/icons/IconArrowUiShareAExportRegular16";
import { Subscription } from "../../Domain/Subscription";
import { Contact } from "../../Domain/Contact";
import { Trigger } from "../../Domain/Trigger";

type FileExportProps = {
    title: string;
    data: Partial<Trigger | Subscription | Contact>;
    children?: ReactNode;
    isButton?: boolean;
};

export default function FileExport({
    title,
    data,
    children,
    isButton,
}: FileExportProps): ReactElement {
    const handleExport = () => {
        const fileData = JSON.stringify(data, undefined, 4);
        const blob = new Blob([fileData], { type: "application/json" });
        saveAs(blob, `${title}.json`);
    };

    return isButton ? (
        <Button onClick={handleExport} icon={<IconArrowUiShareAExportRegular16 />}>
            {children || "Export"}
        </Button>
    ) : (
        <span onClick={handleExport}>{children || "Export"}</span>
    );
}
