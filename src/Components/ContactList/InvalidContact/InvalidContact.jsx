// @flow
import React from "react";
import WarningIcon from "@skbkontur/react-icons/Warning";
import { Button } from "@skbkontur/react-ui/components/Button";
import type { Contact } from "../../../Domain/Contact";
import contactListCN from "../ContactList.less";
import cn from "./InvalidContact.less";

type InvalidContactProps = {
    contact: Contact,
    onRemove: () => void,
};

export default function InvalidContact({ contact, onRemove }: InvalidContactProps) {
    return (
        <tr className={contactListCN("item")}>
            <td className={cn("icon")}>
                <WarningIcon />
            </td>
            <td>
                {contact.value}
                <span className={cn("error-message")}>
                    Contact type {contact.type} not more support.{" "}
                    <Button use="link" onClick={onRemove}>
                        Delete
                    </Button>
                </span>
            </td>
        </tr>
    );
}
