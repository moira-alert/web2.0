import React, { ReactElement, ReactNode, useState } from "react";
import { Button, Tooltip } from "@skbkontur/react-ui";
import { Flexbox } from "../Flexbox/FlexBox";
import ModalError from "../ModalError/ModalError";

interface ConfirmProps {
    message: ReactNode;
    action: () => Promise<void> | void;
    children: ReactNode;
    isLoading?: boolean;
    errorMessage?: string;
    width?: number;
    active?: boolean;
}

export function Confirm({
    message,
    action,
    children,
    isLoading,
    errorMessage = "An error occurred.",
    width,
    active = true,
}: ConfirmProps): ReactElement {
    const [opened, setOpened] = useState(false);
    const [error, setError] = useState("");

    const handleConfirm = async () => {
        try {
            await action();
            setOpened(false);
        } catch (error) {
            setError(error);
        }
    };

    return (
        <Tooltip
            trigger={opened ? "opened" : "closed"}
            pos={"right middle"}
            onCloseClick={() => setOpened(false)}
            onCloseRequest={() => setOpened(false)}
            closeButton={false}
            render={() => (
                <Flexbox width={width} direction="column" gap={8}>
                    {error ? errorMessage : message}
                    <ModalError margin={"0 -35px 0 -30px"} maxWidth="300" message={error} />

                    <Flexbox direction="row" gap={8}>
                        <Button
                            loading={isLoading}
                            onClick={handleConfirm}
                            use={"primary"}
                            width={100}
                        >
                            Confirm
                        </Button>
                        <Button disabled={isLoading} onClick={() => setOpened(false)}>
                            Cancel
                        </Button>
                    </Flexbox>
                </Flexbox>
            )}
        >
            <span onClick={() => (active ? setOpened(true) : handleConfirm())}>{children}</span>
        </Tooltip>
    );
}
