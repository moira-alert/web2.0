import React, { useEffect } from "react";
import { action } from "@storybook/addon-actions";
import { Meta } from "@storybook/react";
import { ConfirmModalHeaderData } from "../Domain/Global";
import useConfirmModal from "../hooks/useConfirmModal";

const meta: Meta = {
    title: "TriggerDeleteModal",
};

const SetupModal = (triggerText: string) => {
    const [ConfirmModal, setModalData] = useConfirmModal();
    useEffect(() => {
        setModalData({
            isOpen: true,
            header: ConfirmModalHeaderData.deleteTrigger,
            body: (
                <>
                    Trigger <strong>{triggerText}</strong> will be deleted.
                </>
            ),
            button: {
                text: "Delete",
                use: "danger",
                onConfirm: () => new Promise(action("onDelete")),
            },
        });
    }, []);

    return <>{ConfirmModal}</>;
};

export const Default = () => SetupModal("test trigger");

export const LongTriggerName = () =>
    SetupModal(
        "ke.notifications-dev.mail-sender.alive.cloud.noname.*.all.metrics.few.error.one.warning.zero.nodata.min.ok"
    );

export default meta;
