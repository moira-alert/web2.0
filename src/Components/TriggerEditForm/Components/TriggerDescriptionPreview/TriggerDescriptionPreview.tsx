import { FC, useEffect } from "react";
import { DtoTriggerDescriptionPreviewRequest } from "../../../../Domain/__generated__/data-contracts";
import { usePreviewTriggerDescriptionMutation } from "../../../../services/TriggerApi";
import { Spinner } from "@skbkontur/react-ui";
import { IconWarningTriangleRegular16 } from "@skbkontur/icons/IconWarningTriangleRegular16";

import styles from "./TriggerDescriptionPreview.module.less";
import { MarkdownViewer } from "@skbkontur/markdown";

export const TriggerDescriptionPreview: FC<DtoTriggerDescriptionPreviewRequest> = ({
    trigger_id,
    name,
    desc,
}) => {
    const [previewDescription, { data, isLoading }] = usePreviewTriggerDescriptionMutation();

    useEffect(() => {
        const request = previewDescription({ trigger_id, name, desc, handleLoadingLocally: true });

        return () => request.abort();
    }, [previewDescription, trigger_id, name, desc]);

    if (isLoading) return <Spinner caption="Loading preview" />;

    const errorMessage = data?.description_render?.error || null;

    return (
        <>
            {data?.description_render?.events_source === "demo" && (
                <p>
                    <IconWarningTriangleRegular16 className={styles.warningIcon} /> Preview uses
                    demo data because no recent events are available.
                </p>
            )}
            {errorMessage ? (
                <div>{errorMessage}</div>
            ) : (
                <MarkdownViewer source={data?.description ?? ""} />
            )}
        </>
    );
};
