import * as React from "react";
import { Input } from "@skbkontur/react-ui/components/Input";
import { Select } from "@skbkontur/react-ui/components/Select";
import { ValidationWrapperV1, tooltip, ValidationInfo } from "@skbkontur/react-ui-validations";
import { ContactConfig } from "../../Domain/Config";
import { Contact } from "../../Domain/Contact";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import { Markdown } from "../Markdown/Markdown";
import { Gapped } from "@skbkontur/react-ui";
import classNames from "classnames/bind";

import styles from "./ContactEditForm.less";

const cn = classNames.bind(styles);

type Props = {
    contactDescriptions: Array<ContactConfig>;
    contactInfo: Partial<Contact> | null;
    onChange: (contact: Partial<Contact>) => void;
};

export default class ContactEditForm extends React.Component<Props> {
    render(): React.ReactElement {
        const { onChange, contactInfo, contactDescriptions } = this.props;
        const { value = "", type, name } = contactInfo || {};
        const currentContactConfig = contactDescriptions.find((contact) => contact.type === type);
        const contactItems: Array<[string, string]> = contactDescriptions.map((contact) => [
            contact.type,
            contact.label,
        ]);

        return (
            <Gapped vertical gap={10}>
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

                <ValidationWrapperV1
                    renderMessage={tooltip("top left")}
                    validationInfo={this.validateValue()}
                >
                    <Input
                        width="100%"
                        disabled={type == null}
                        placeholder={
                            (currentContactConfig && currentContactConfig.placeholder) || ""
                        }
                        value={value}
                        onValueChange={(value) => onChange({ value })}
                    />
                </ValidationWrapperV1>

                <Input
                    width="100%"
                    placeholder="Type your custom contact name"
                    value={name}
                    onValueChange={(name) => onChange({ name })}
                />

                {currentContactConfig?.help && (
                    <Markdown markdown={currentContactConfig.help} className={cn("comment")} />
                )}
            </Gapped>
        );
    }

    validateValue(): ValidationInfo | null {
        const { contactInfo, contactDescriptions } = this.props;

        if (!contactInfo) {
            return null;
        }

        const { value = "", type } = contactInfo;
        const currentContactConfig = contactDescriptions.find((x) => x.type === type);

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
    }
}
