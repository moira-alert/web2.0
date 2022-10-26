import React from "react";
import { action } from "@storybook/addon-actions";
import { TriggerDeleteModal } from "../Components/TriggerDeleteModal/TriggerDeleteModal";

export default {
    title: "TriggerDeleteModal",
    component: TriggerDeleteModal,
    decorators: [
        (story: () => JSX.Element) => (
            <div style={{ height: "100vh", width: "100%" }}>{story()}</div>
        ),
    ],
};

export const Default = () => (
    <TriggerDeleteModal
        triggerName={"test trigger"}
        onClose={action("onClose")}
        onDelete={() => new Promise(action("onDelete"))}
    />
);

export const LongTriggerName = () => (
    <TriggerDeleteModal
        triggerName={
            "ke.notifications-dev.mail-sender.alive.cloud.noname.*.all.metrics.few.error.one.warning.zero.nodata.min.ok"
        }
        onClose={action("onClose")}
        onDelete={() => new Promise(action("onDelete"))}
    />
);
