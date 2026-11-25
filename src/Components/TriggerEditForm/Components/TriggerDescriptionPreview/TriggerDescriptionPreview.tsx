import { FC, PropsWithChildren, useEffect } from "react";
import { DtoTriggerDescriptionPreviewRequest } from "../../../../Domain/__generated__/data-contracts";
import { usePreviewTriggerDescriptionMutation } from "../../../../services/TriggerApi";
import { Spinner } from "@skbkontur/react-ui";
import { IconWarningTriangleRegular16 } from "@skbkontur/icons/IconWarningTriangleRegular16";
import { MarkdownViewer } from "@skbkontur/markdown";

import styles from "./TriggerDescriptionPreview.module.less";
import { Flexbox } from "../../../Flexbox/FlexBox";

export const TriggerDescriptionPreview: FC<DtoTriggerDescriptionPreviewRequest> = ({
    trigger_id,
    name,
    description,
}) => {
    const [previewDescription, { data, isLoading, error }] = usePreviewTriggerDescriptionMutation();

    useEffect(() => {
        const request = previewDescription({
            trigger_id,
            name,
            description,
            handleLoadingLocally: true,
            handleErrorLocally: true,
        });

        return () => request.abort();
    }, [previewDescription, trigger_id, name, description]);

    if (isLoading)
        return (
            <Flexbox>
                <Spinner caption="Loading preview" />
            </Flexbox>
        );

    if (error) {
        return (
            <PreviewWarning>
                {typeof error === "string" ? error : "Failed to render preview"}
            </PreviewWarning>
        );
    }

    return (
        <>
            {data?.events_source === "demo" && (
                <PreviewWarning>
                    Preview uses demo data because no recent events are available.
                </PreviewWarning>
            )}

            <MarkdownViewer source={data?.description ?? ""} />
        </>
    );
};

const PreviewWarning: FC<PropsWithChildren> = ({ children }) => (
    <p>
        <IconWarningTriangleRegular16 className={styles.warningIcon} /> {children}
    </p>
);
