import React, { FC, Fragment } from "react";
import { format, parseISO } from "date-fns";

interface TriggerCRUDInfoProps {
    created_at?: string | null;
    created_by?: string;
    updated_at?: string | null;
    updated_by?: string;
}

interface CRUDBlock {
    label: "Created" | "Updated";
    by?: string;
    at?: string | null;
}

export const TriggerCRUDInfo: FC<TriggerCRUDInfoProps> = ({
    created_at,
    created_by,
    updated_at,
    updated_by,
}) => {
    const blocks: CRUDBlock[] = [
        {
            label: "Created",
            by: created_by,
            at: created_at,
        },
        {
            label: "Updated",
            by: updated_by,
            at: updated_at,
        },
    ];

    return (
        <>
            {blocks.map(
                ({ label, by, at }) =>
                    by &&
                    at && (
                        <Fragment key={label}>
                            <dt>{label} by</dt>
                            <dd>{by}</dd>
                            <dt>{label} at</dt>
                            <dd>{format(parseISO(at), "dd MMMM yyyy HH:mm")}</dd>
                        </Fragment>
                    )
            )}
        </>
    );
};
