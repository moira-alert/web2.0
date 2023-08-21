import { ActionType } from "../../hooks/useTriggerFormContainerReducer";
import { Button, Modal } from "@skbkontur/react-ui";
import React from "react";

export function SaveTriggerModal({ state, dispatch, action }) {
    return (
        state.isSaveModalVisible && (
            <Modal
                onClose={() => dispatch({ type: ActionType.setIsSaveModalVisible, payload: false })}
            >
                <Modal.Header>Test</Modal.Header>
                <Modal.Body>
                    The Graphite function you&apos;ve used makes no sense in Moira or may generate
                    unwanted side effects. Are you sure you want to save this trigger?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={action} use="primary">
                        Save
                    </Button>
                    <Button
                        onClick={() =>
                            dispatch({
                                type: ActionType.setIsSaveModalVisible,
                                payload: false,
                            })
                        }
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    );
}
