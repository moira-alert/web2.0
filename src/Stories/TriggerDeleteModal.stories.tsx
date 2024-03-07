import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta } from "@storybook/react";
import { ConfirmModal } from "../Components/ConfirmModal/ConfirmModal";
import { useAppDispatch } from "../store/hooks";
import { toggleModal, setModalData } from "../store/Reducers/UIReducer.slice";

const meta: Meta = {
    title: "TriggerDeleteModal",
    component: ConfirmModal,
};

const SetupModal = (triggerText: string) => {
    const dispatch = useAppDispatch();

    dispatch(toggleModal(true));
    dispatch(
        setModalData({
            header: "Delete trigger?",
            button: {
                text: "Delete",
                use: "danger",
            },
        })
    );
    return (
        <ConfirmModal onConfirm={action("onConfirm")}>
            Trigger <strong>{triggerText}</strong> will be deleted.
        </ConfirmModal>
    );
};

export const Default = () => SetupModal("test trigger");

export const LongTriggerName = () =>
    SetupModal(
        "ke.notifications-dev.mail-sender.alive.cloud.noname.*.all.metrics.few.error.one.warning.zero.nodata.min.ok"
    );

export default meta;
