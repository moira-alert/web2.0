import React, { ReactElement, useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { Button, Modal } from "@skbkontur/react-ui";
import ModalError from "../Components/ModalError/ModalError";

export default {
    title: "ModalError",
    component: ModalError,
    creevey: {
        captureElement: "#root",
    },
    decorators: [
        (story: () => JSX.Element) => <MemoryRouter>{story()}</MemoryRouter>,
        (story: () => JSX.Element) => (
            <div style={{ height: "100vh", width: "100%" }}>{story()}</div>
        ),
    ],
};

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

export const ErrorHidden = () => (
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

export const ErrorShown = () => (
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
