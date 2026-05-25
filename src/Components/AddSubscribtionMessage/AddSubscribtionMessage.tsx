import type { FC, ReactElement } from "react";
import { Button, Center } from "@skbkontur/react-ui";
import { Flexbox } from "../Flexbox/FlexBox";
import { IconPlusRegular16 } from "@skbkontur/icons/IconPlusRegular16";

interface Props {
    onAddSubscription: () => void;
}

export const AddSubscriptionMessage: FC<Props> = ({ onAddSubscription }): ReactElement => {
    return (
        <Center>
            <Flexbox gap={20}>
                <div>
                    To start receiving notifications you have to{" "}
                    <Button use="link" onClick={onAddSubscription}>
                        add subscription
                    </Button>
                    .
                </div>
                <Center>
                    <Button use="primary" icon={<IconPlusRegular16 />} onClick={onAddSubscription}>
                        Add subscription
                    </Button>
                </Center>
            </Flexbox>
        </Center>
    );
};
