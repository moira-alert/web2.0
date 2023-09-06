import React from "react";
import { Button, Gapped, Modal } from "@skbkontur/react-ui";

type Props = {
    message: string;
    children?: React.ReactNode;
    onClose: () => void;
    onDelete: () => Promise<void>;
};

export const ConfirmDeleteModal = (props: Props): JSX.Element => (
    <Modal width={600} onClose={props.onClose}>
        <Modal.Header>{props.message}</Modal.Header>
        <Modal.Body data-tid="Delete Trigger Modal Body">{props.children}</Modal.Body>
        <Modal.Footer>
            <Gapped gap={8}>
                <Button onClick={props.onClose} use="primary" data-tid="Close Delete Modal">
                    Cancel
                </Button>
                <Button onClick={props.onDelete} use="danger" data-tid="Delete Trigger">
                    Delete
                </Button>
            </Gapped>
        </Modal.Footer>
    </Modal>
);
