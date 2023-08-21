import { Action, ActionType, State } from "../../hooks/useTriggerFormContainerReducer";
import { Button, Gapped, Modal } from "@skbkontur/react-ui";
import React, { Dispatch } from "react";
import { Trigger } from "../../Domain/Trigger";

export function TriggerSaveModal({
    state,
    dispatch,
    callback,
}: {
    state: State;
    dispatch: Dispatch<Action>;
    callback: (trigger?: Trigger | undefined) => Promise<void>;
}) {
    return (
        (state.isSaveModalVisible && (
            <Modal
                width={600}
                onClose={() => dispatch({ type: ActionType.setIsSaveModalVisible, payload: false })}
            >
                <Modal.Header>Test</Modal.Header>
                <Modal.Body>
                    The Graphite function you&apos;ve used makes no sense in Moira or may generate
                    unwanted side effects. Are you sure you want to save this trigger?
                </Modal.Body>
                <Modal.Footer>
                    <Gapped gap={8}>
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
                        <Button onClick={() => callback()} use="primary">
                            Save
                        </Button>
                    </Gapped>
                </Modal.Footer>
            </Modal>
        )) ||
        null
    );
}
