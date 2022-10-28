import * as React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { TriggerDeleteModal } from "../Components/TriggerDeleteModal/TriggerDeleteModal";
import { captureElementParams } from "./Data/captureElementParams";

storiesOf("TriggerDeleteModal", module)
    .add(
        "Default",
        () => (
            <TriggerDeleteModal
                triggerName={"test trigger"}
                onClose={action("onClose")}
                onDelete={() => new Promise(action("onDelete"))}
            />
        ),
        captureElementParams
    )
    .add(
        "Long trigger name",
        () => (
            <TriggerDeleteModal
                triggerName={
                    "ke.notifications-dev.mail-sender.alive.cloud.noname.*.all.metrics.few.error.one.warning.zero.nodata.min.ok"
                }
                onClose={action("onClose")}
                onDelete={() => new Promise(action("onDelete"))}
            />
        ),
        captureElementParams
    );
