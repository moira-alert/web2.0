import React from "react";
import { Button, Gapped, Modal } from "@skbkontur/react-ui";

type Props = {
    triggerName: string;
    onClose: () => void;
    onDelete: () => Promise<void>;
};

export const TriggerDeleteModal = (props: Props): JSX.Element => (
    <Modal width={600} noClose>
        <Modal.Header>Delete Trigger?</Modal.Header>
        <Modal.Body data-tid="Delete Trigger Modal Body">
            Trigger {<strong>{props.triggerName}</strong>} will be deleted.
        </Modal.Body>
        <Modal.Footer>
            <Gapped gap={8}>
                <Button
                    onClick={props.onClose}
                    use={"primary"}
                    data-tid="Delete Trigger Modal Cancel Button"
                >
                    Cancel
                </Button>
                <Button onClick={props.onDelete} data-tid="Delete Trigger Modal Delete Button">
                    Delete
                </Button>
            </Gapped>
        </Modal.Footer>
    </Modal>
);
