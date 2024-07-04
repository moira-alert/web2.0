import React, { ReactElement, ReactNode, useState } from "react";
import { Button, Gapped, Tooltip } from "@skbkontur/react-ui";
import { Grid } from "../Grid/Grid";

interface ConfirmProps {
    message: string;
    action: () => Promise<void> | void;
    children: ReactNode;
    loading?: boolean;
}

export function Confirm({ message, action, children, loading }: ConfirmProps): ReactElement {
    const [opened, setOpened] = useState(false);

    const handleConfirm = async () => {
        await action();
        setOpened(false);
    };

    return (
        <Tooltip
            trigger={opened ? "opened" : "closed"}
            pos={"right middle"}
            onCloseClick={() => setOpened(false)}
            onCloseRequest={() => setOpened(false)}
            closeButton={false}
            render={() => (
                <Grid columns={"320px"} gap="16px 8px">
                    {message}
                    <Gapped>
                        <Button
                            loading={loading}
                            onClick={handleConfirm}
                            use={"primary"}
                            width={100}
                        >
                            Confirm
                        </Button>
                        <Button onClick={() => setOpened(false)}>Cancel</Button>
                    </Gapped>
                </Grid>
            )}
        >
            <span onClick={() => setOpened(true)}>{children}</span>
        </Tooltip>
    );
}
