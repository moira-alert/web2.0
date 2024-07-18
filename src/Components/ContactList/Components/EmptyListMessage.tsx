import React, { FC } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Center } from "@skbkontur/react-ui/components/Center";
import { Gapped } from "@skbkontur/react-ui/components/Gapped";
import AddIcon from "@skbkontur/react-icons/Add";

export const EmptyListMessage: FC<{ onCLick: () => void }> = ({ onCLick }) => (
    <Center>
        <Gapped vertical gap={20}>
            <div style={{ textAlign: "center" }}>
                To start receiving notifications you have to{" "}
                <Button use="link" onClick={onCLick}>
                    add delivery channel
                </Button>{" "}
                for notifications.
            </div>
            <Center>
                <Button use="primary" icon={<AddIcon />} onClick={onCLick}>
                    Add delivery channel
                </Button>
            </Center>
        </Gapped>
    </Center>
);
