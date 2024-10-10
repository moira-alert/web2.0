import React, { useCallback } from "react";
import { Input } from "@skbkontur/react-ui/components/Input";
import { Select } from "@skbkontur/react-ui/components/Select";
import { ValidationWrapperV1, tooltip } from "@skbkontur/react-ui-validations";
import { Contact, ContactTypes } from "../../Domain/Contact";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import { Markdown } from "../Markdown/Markdown";
import { Flexbox } from "../Flexbox/FlexBox";
import { Fill, Fixed, RowStack } from "@skbkontur/react-stack-layout";
import { isEmptyString } from "../../helpers/isEmptyString";
import { validateContactValueWithConfigRegExp } from "../../helpers/validations";
import { useSelector } from "react-redux";
import {
    selectContactConfigByType,
    selectContactConfigItems,
} from "../../store/Reducers/ConfigReducer.slice";
import { RootState } from "../../store/store";
import classNames from "classnames/bind";

import styles from "./ContactEditForm.less";

const cn = classNames.bind(styles);

interface IContactEditFormProps {
    contactInfo: Partial<Contact> | null;
    onChange: (contact: Partial<Contact>) => void;
}

const ContactEditForm: React.FC<IContactEditFormProps> = ({ contactInfo, onChange }) => {
    const { value, type, name } = contactInfo || {};
    const contactItems = useSelector(selectContactConfigItems);
    const currentContactConfig = useSelector((state: RootState) =>
        type ? selectContactConfigByType(state, type as ContactTypes) : null
    );

    const renderItem = useCallback((v: string, item?: string) => {
        return (
            <span>
                {v && <ContactTypeIcon type={v} />} {item}
            </span>
        );
    }, []);

    return (
        <Flexbox gap={10}>
            <Select<string, string>
                placeholder="Select channel type"
                width="100%"
                value={type}
                renderItem={renderItem}
                renderValue={renderItem}
                onValueChange={(v) => {
                    v && onChange({ type: v as ContactTypes });
                }}
                items={contactItems}
                data-tid="Select channel type"
            />
            <RowStack block baseline>
                <Fixed width={100}>Contact value:</Fixed>
                <Fill>
                    <ValidationWrapperV1
                        renderMessage={tooltip("top left")}
                        validationInfo={validateContactValueWithConfigRegExp(
                            value,
                            currentContactConfig?.validation
                        )}
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
        </Flexbox>
    );
};

export default ContactEditForm;
