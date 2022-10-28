import React, { ReactElement, useState } from "react";
import { storiesOf } from "@storybook/react";
import { Button, Modal } from "@skbkontur/react-ui";
import ModalError from "../Components/ModalError/ModalError";
import { captureElementParams } from "./Data/captureElementParams";

const ERROR_MESSAGE = `File empty.json cannot be converted to subscription. Unexpected end of JSON input`;

type WrapperProps = {
    init?: boolean;
    children: (message: string | undefined, handleView: () => void) => ReactElement;
};

const Wrapper = ({ children, init }: WrapperProps) => {
    const [message, setMessage] = useState(init ? ERROR_MESSAGE : undefined);
    const handleView = () => {
        setMessage(message ? undefined : ERROR_MESSAGE);
    };
    return children(message, handleView);
};

storiesOf("ModalError", module)
    .add(
        "Error hidden",
        () => {
            return (
                <Wrapper>
                    {(message, handleClick) => (
                        <Modal width="600px">
                            <Modal.Header>Error panel</Modal.Header>
                            <Modal.Body>Content without error</Modal.Body>
                            <Modal.Footer>
                                <ModalError message={message} />
                                <Button onClick={handleClick}>{message ? "Hide" : "Show"}</Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </Wrapper>
            );
        },
        captureElementParams
    )
    .add(
        "Error shown",
        () => {
            return (
                <Wrapper init>
                    {(message, handleClick) => (
                        <Modal width="600px">
                            <Modal.Header>Error panel</Modal.Header>
                            <Modal.Body>Content with error</Modal.Body>
                            <Modal.Footer>
                                <ModalError message={message} />
                                <Button onClick={handleClick}>{message ? "Hide" : "Show"}</Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </Wrapper>
            );
        },
        captureElementParams
    );
