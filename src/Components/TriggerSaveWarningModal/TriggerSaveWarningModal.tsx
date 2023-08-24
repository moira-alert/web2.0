import { Button, Gapped, Modal } from "@skbkontur/react-ui";
import React from "react";

export function TriggerSaveWarningModal({
    isOpen,
    onClose,
    onSave,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => Promise<void>;
}) {
    return (
        (isOpen && (
            <Modal width={600} onClose={onClose}>
                <Modal.Header>Save trigger</Modal.Header>
                <Modal.Body>
                    The Graphite function you&apos;ve used makes no sense in Moira or may generate
                    unwanted side effects. Are you sure you want to save this trigger?
                </Modal.Body>
                <Modal.Footer>
                    <Gapped gap={8}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={onSave} use="primary">
                            Save
                        </Button>
                    </Gapped>
                </Modal.Footer>
            </Modal>
        )) ||
        null
    );
}
