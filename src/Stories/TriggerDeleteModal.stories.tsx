import * as React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { ConfirmDeleteModal } from "../Components/ConfirmDeleteModal/ConfirmDeleteModal";

storiesOf("TriggerDeleteModal", module)
    .add("Default", () => (
        <ConfirmDeleteModal
            message={"Delete Trigger?"}
            onClose={action("onClose")}
            onDelete={() => new Promise(action("onDelete"))}
        >
            Trigger <strong>test trigger</strong> will be deleted.
        </ConfirmDeleteModal>
    ))
    .add("Long trigger name", () => (
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
    ));
