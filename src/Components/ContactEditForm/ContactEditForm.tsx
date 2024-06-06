import React, { useCallback } from "react";
import { Input } from "@skbkontur/react-ui/components/Input";
import { Select } from "@skbkontur/react-ui/components/Select";
import { ValidationWrapperV1, tooltip, ValidationInfo } from "@skbkontur/react-ui-validations";
import { Contact, ContactTypes } from "../../Domain/Contact";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import { Markdown } from "../Markdown/Markdown";
import { useAppSelector } from "../../store/hooks";
import { ConfigState } from "../../store/selectors";
import classNames from "classnames/bind";

import styles from "./ContactEditForm.less";

const cn = classNames.bind(styles);

type Props = {
    contactInfo: Partial<Contact> | null;
    onChange: (contact: Partial<Contact>) => void;
};

const ContactEditForm: React.FC<Props> = ({ contactInfo, onChange }) => {
    const { config } = useAppSelector(ConfigState);
    const { value = "", type } = contactInfo || {};
    const currentContactConfig = config?.contacts.find((contact) => contact.type === type);
    const contactItems: Array<[ContactTypes, string]> = (config?.contacts ?? []).map((contact) => [
        contact.type,
        contact.label,
    ]);

    const validateValue = useCallback((): ValidationInfo | null => {
        if (!contactInfo?.value) {
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
    }, [contactInfo?.value]);

    return (
        <>
            <div className={cn("row")}>
                <Select<string, string>
                    placeholder="Select channel type"
                    width="100%"
                    value={type}
                    renderItem={(v, item) => (
                        <span>
                            {v && <ContactTypeIcon type={v} />} {item}
                        </span>
                    )}
                    renderValue={(v, item) => (
                        <span>
                            {v && <ContactTypeIcon type={v} />} {item}
                        </span>
                    )}
                    onValueChange={(v) => {
                        v && onChange({ type: v });
                    }}
                    items={contactItems}
                    data-tid="Select channel type"
                />
            </div>
            <div className={cn("row")}>
                <ValidationWrapperV1
                    renderMessage={tooltip("top left")}
                    validationInfo={validateValue()}
                >
                    <Input
                        width="100%"
                        disabled={type == null}
                        placeholder={
                            (currentContactConfig && currentContactConfig.placeholder) || ""
                        }
                        value={value}
                        onValueChange={(v) => onChange({ value: v })}
                    />
                </ValidationWrapperV1>
            </div>
            {currentContactConfig?.help && (
                <Markdown markdown={currentContactConfig.help} className={cn("row", "comment")} />
            )}
        </>
    );
};

export default ContactEditForm;
