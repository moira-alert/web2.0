import React from "react";
import { Button, Center, Gapped } from "@skbkontur/react-ui";
import AddIcon from "@skbkontur/react-icons/Add";

interface Props {
    onAddSubscription: () => void;
}

export const AddSubscriptionMessage: React.FC<Props> = ({
    onAddSubscription,
}): React.ReactElement => {
    return (
        <Center>
            <Gapped vertical gap={20}>
                <div>
                    To start receiving notifications you have to{" "}
                    <Button use="link" onClick={onAddSubscription}>
                        add subscription
                    </Button>
                    .
                </div>
                <Center>
                    <Button use="primary" icon={<AddIcon />} onClick={onAddSubscription}>
                        Add subscription
                    </Button>
                </Center>
            </Gapped>
        </Center>
    );
};
