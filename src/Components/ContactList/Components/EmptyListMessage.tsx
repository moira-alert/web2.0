import { FC } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Center } from "@skbkontur/react-ui/components/Center";
import { IconPlusRegular16 } from "@skbkontur/icons/IconPlusRegular16";
import { Flexbox } from "../../Flexbox/FlexBox";

export const EmptyListMessage: FC<{ onCLick: () => void }> = ({ onCLick }) => (
    <Center>
        <Flexbox gap={20}>
            <div style={{ textAlign: "center" }}>
                To start receiving notifications you have to add delivery channel for notifications.
            </div>
            <Center>
                <Button use="accent" icon={<IconPlusRegular16 />} onClick={onCLick}>
                    Add delivery channel
                </Button>
            </Center>
        </Flexbox>
    </Center>
);
