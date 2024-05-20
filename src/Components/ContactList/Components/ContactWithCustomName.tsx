import React, { FC } from "react";
import Info from "@skbkontur/react-icons/Info";
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
                <Info style={{ verticalAlign: "text-top" }} />
            </Tooltip>
        </>
    );
};
