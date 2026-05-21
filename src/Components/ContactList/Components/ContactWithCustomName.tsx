import { FC } from "react";
import { IconInfoSquareLight16 } from "@skbkontur/icons/IconInfoSquareLight16";
import { Tooltip } from "@skbkontur/react-ui";

interface IContactWithCustomNameProps {
    contactValue: string;
    contactName: string | undefined;
}

export const ContactWithCustomName: FC<IContactWithCustomNameProps> = ({
    contactValue,
    contactName,
}) => {
    return (
        <>
            {contactName}&nbsp;
            <Tooltip render={() => `Contact value: ${contactValue}`}>
                <IconInfoSquareLight16 data-tid={`${contactName} alias icon`} />
            </Tooltip>
        </>
    );
};
