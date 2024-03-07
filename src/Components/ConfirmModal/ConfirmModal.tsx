import React from "react";
import { Button, Gapped, Modal } from "@skbkontur/react-ui";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { toggleModal } from "../../store/Reducers/UIReducer.slice";

interface IConfirmModalProps {
    children?: React.ReactNode;
    onConfirm?: () => void;
}

export const ConfirmModal = ({ children, onConfirm }: IConfirmModalProps): JSX.Element | null => {
    const { isModalOpen, modalData } = useAppSelector(UIState);
    const dispatch = useAppDispatch();

    return isModalOpen ? (
        <Modal width={600} onClose={() => dispatch(toggleModal(false))}>
            <Modal.Header>{modalData.header}</Modal.Header>
            <Modal.Body>{children || modalData.body}</Modal.Body>
            <Modal.Footer>
                <Gapped gap={8}>
                    <Button onClick={() => dispatch(toggleModal(false))} use="primary">
                        Cancel
                    </Button>
                    {modalData.button && (
                        <Button onClick={onConfirm} use={modalData.button.use}>
                            {modalData.button.text}
                        </Button>
                    )}
                </Gapped>
            </Modal.Footer>
        </Modal>
    ) : null;
};
