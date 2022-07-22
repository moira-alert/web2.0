import * as React from "react";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { TriggerDeleteModal } from "../Components/TriggerDeleteModal/TriggerDeleteModal";

storiesOf("TriggerDeleteModal", module).add("Default", () => (
    <TriggerDeleteModal
        triggerName={"test trigger"}
        onClose={action("onClose")}
        onDelete={() => new Promise(action("onDelete"))}
    />
));
