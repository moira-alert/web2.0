import React, { ReactElement, ReactNode, useState } from "react";
import { Button, Gapped, Tooltip } from "@skbkontur/react-ui";
import { Grid } from "../Grid/Grid";

interface ConfirmProps {
    message: string;
    action: () => void;
    children: ReactNode;
}

export function Confirm(props: ConfirmProps): ReactElement {
    const [opened, setOpened] = useState(false);

    const handleConfirm = () => {
        setOpened(false);
        props.action();
    };

    return (
        <Tooltip
            trigger={opened ? "opened" : "closed"}
            pos={"right middle"}
            onCloseClick={() => setOpened(false)}
            onCloseRequest={() => setOpened(false)}
            closeButton={false}
            render={() => (
                <Grid columns={"auto"} gap="16px 8px">
                    {props.message}
                    <Gapped>
                        <Button onClick={handleConfirm} use={"primary"} width={100}>
                            Confirm
                        </Button>
                        <Button onClick={() => setOpened(false)}>Cancel</Button>
                    </Gapped>
                </Grid>
            )}
        >
            <span onClick={() => setOpened(true)}>{props.children}</span>
        </Tooltip>
    );
}
