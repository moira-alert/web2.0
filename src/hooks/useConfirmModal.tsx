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

type UseConfirmModalReturn = [
    JSX.Element | null,
    Dispatch<SetStateAction<Partial<TModalData> | null>>
];

const useConfirmModal = (): UseConfirmModalReturn => {
    const [modalData, setModalData] = useState<Partial<TModalData> | null>(null);

    const ConfirmModal = modalData?.isOpen ? (
        <Modal width={600} onClose={() => setModalData({ isOpen: false })}>
            <Modal.Header>{modalData.header}</Modal.Header>
            <Modal.Body>{modalData.body}</Modal.Body>
            <Modal.Footer>
                <Flexbox direction="row" gap={8}>
                    <Button onClick={() => setModalData({ isOpen: false })} use="primary">
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
    ) : null;

    return [ConfirmModal, setModalData];
};
export default useConfirmModal;
