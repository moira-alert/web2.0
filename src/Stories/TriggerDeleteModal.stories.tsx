import * as React from "react";
import { action } from "@storybook/addon-actions";
import { ConfirmDeleteModal } from "../Components/ConfirmDeleteModal/ConfirmDeleteModal";

export default {
    title: "TriggerDeleteModal",
};

export const Default = () => (
    <ConfirmDeleteModal
        message={"Delete Trigger?"}
        onClose={action("onClose")}
        onDelete={() => new Promise(action("onDelete"))}
    >
        Trigger <strong>test trigger</strong> will be deleted.
    </ConfirmDeleteModal>
);

export const LongTriggerName = () => (
    <ConfirmDeleteModal
        message={"Delete Trigger?"}
        onClose={action("onClose")}
        onDelete={() => new Promise(action("onDelete"))}
    >
        Trigger&nbsp;
        <strong>
            ke.notifications-dev.mail-sender.alive.cloud.noname.*.all.metrics.few.error.one.warning.zero.nodata.min.ok
        </strong>
        &nbsp; will be deleted.
    </ConfirmDeleteModal>
);
