import React, { useCallback } from "react";
import { Input } from "@skbkontur/react-ui/components/Input";
import { Select } from "@skbkontur/react-ui/components/Select";
import { ValidationWrapperV1, tooltip, ValidationInfo } from "@skbkontur/react-ui-validations";
import { Contact, ContactTypes } from "../../Domain/Contact";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import { Markdown } from "../Markdown/Markdown";
import { useAppSelector } from "../../store/hooks";
import { ConfigState } from "../../store/selectors";
import { Gapped } from "@skbkontur/react-ui";
import { Fill, Fixed, RowStack } from "@skbkontur/react-stack-layout";
import { isEmptyString } from "../../helpers/isEmptyString";
import classNames from "classnames/bind";

import styles from "./ContactEditForm.less";

const cn = classNames.bind(styles);

interface IContactEditFormProps {
    contactInfo: Partial<Contact> | null;
    onChange: (contact: Partial<Contact>) => void;
}

const ContactEditForm: React.FC<IContactEditFormProps> = ({ contactInfo, onChange }) => {
    const { config } = useAppSelector(ConfigState);
    const { value, type, name } = contactInfo || {};
    const currentContactConfig = config?.contacts.find((contact) => contact.type === type);
    const contactItems: Array<[ContactTypes, string]> = (config?.contacts ?? []).map((contact) => [
        contact.type,
        contact.label,
    ]);

    const validateValue = useCallback((): ValidationInfo | null => {
        if (!value) {
            return {
                message: "Contact value can`t be empty",
                type: "submit",
            };
        }

        if (!currentContactConfig || !currentContactConfig.validation) {
            return null;
        }

        const re = new RegExp(currentContactConfig.validation, "i");

        return value.trim().match(re)
            ? null
            : {
                  message: "Invalid format",
                  type: "submit",
              };
    }, [value]);

    const renderItem = (v: string, item?: string) => {
        return (
            <span>
                {v && <ContactTypeIcon type={v} />} {item}
            </span>
        );
    };

    return (
        <Gapped vertical gap={10}>
            <Select<string, string>
                placeholder="Select channel type"
                width="100%"
                value={type}
                renderItem={renderItem}
                renderValue={renderItem}
                onValueChange={(v) => {
                    v && onChange({ type: v });
                }}
                items={contactItems}
                data-tid="Select channel type"
            />
            <RowStack block baseline>
                <Fixed width={100}>Contact value:</Fixed>
                <Fill>
                    <ValidationWrapperV1
                        renderMessage={tooltip("top left")}
                        validationInfo={validateValue()}
                    >
                        <Input
                            width="100%"
                            disabled={isEmptyString(type)}
                            placeholder={
                                (currentContactConfig && currentContactConfig.placeholder) || ""
                            }
                            value={value}
                            onValueChange={(v) => onChange({ value: v })}
                        />
                    </ValidationWrapperV1>
                </Fill>
            </RowStack>
            <RowStack block baseline>
                <Fixed width={100}>Contact name:</Fixed>
                <Input
                    width="100%"
                    placeholder="Type your custom contact name"
                    value={name}
                    onValueChange={(name) => onChange({ name })}
                />
            </RowStack>
            {currentContactConfig?.help && (
                <Markdown markdown={currentContactConfig.help} className={cn("row", "comment")} />
            )}
        </Gapped>
    );
};

export default ContactEditForm;
