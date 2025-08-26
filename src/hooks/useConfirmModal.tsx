import React, { useState, Dispatch, SetStateAction } from "react";
import { ButtonUse } from "@skbkontur/react-ui";
import { Button, Modal } from "@skbkontur/react-ui";
import { Flexbox } from "../Components/Flexbox/FlexBox";

type TModalButton = {
    text: string;
    use?: ButtonUse;
    onConfirm: () => Promise<void> | void;
};

type TModalData = {
    isOpen: boolean;
    header: string;
    body?: string | React.ReactNode;
    button?: TModalButton;
};

type UseConfirmModalReturn = {
    modalData: Partial<TModalData> | null;
    setModalData: Dispatch<SetStateAction<Partial<TModalData> | null>>;
    closeModal: () => void;
};

const useConfirmModal = (): UseConfirmModalReturn => {
    const [modalData, setModalData] = useState<Partial<TModalData> | null>(null);

    const closeModal = () => setModalData({ isOpen: false });

    return { modalData, setModalData, closeModal };
};

export const ConfirmModal: React.FC<{
    modalData: Partial<TModalData> | null;
    closeModal: () => void;
}> = ({ modalData, closeModal }) => {
    if (!modalData?.isOpen) return null;

    return (
        <Modal width={600} onClose={closeModal}>
            <Modal.Header>{modalData.header}</Modal.Header>
            <Modal.Body>{modalData.body}</Modal.Body>
            <Modal.Footer>
                <Flexbox direction="row" gap={8}>
                    <Button onClick={closeModal} use="primary">
                        Cancel
                    </Button>
                    {modalData.button && (
                        <Button
                            onClick={() => modalData.button?.onConfirm()}
                            use={modalData.button.use}
                        >
                            {modalData.button.text}
                        </Button>
                    )}
                </Flexbox>
            </Modal.Footer>
        </Modal>
    );
};

export default useConfirmModal;
