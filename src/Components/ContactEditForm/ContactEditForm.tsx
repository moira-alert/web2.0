import * as React from "react";
import { Input } from "@skbkontur/react-ui/components/Input";
import { Select } from "@skbkontur/react-ui/components/Select";
import { ValidationWrapperV1, tooltip, ValidationInfo } from "@skbkontur/react-ui-validations";
import { ContactConfig } from "../../Domain/Config";
import { Contact } from "../../Domain/Contact";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import ReactMarkdown from "react-markdown";
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
        const { value = "", type } = contactInfo || {};
        const currentContactConfig = contactDescriptions.find((contact) => contact.type === type);
        const contactItems: Array<[string, string]> = contactDescriptions.map((contact) => [
            contact.type,
            contact.label,
        ]);

        return (
            <div className={cn("form")}>
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
                            // ToDo разобраться, почему value может отсутствовать
                            v && onChange({ type: v });
                        }}
                        items={contactItems}
                    />
                </div>
                <div className={cn("row")}>
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
                            onValueChange={(v) => onChange({ value: v })}
                        />
                    </ValidationWrapperV1>
                </div>
                {currentContactConfig?.help && (
                    <ReactMarkdown className={cn("row", "comment")}>
                        {currentContactConfig.help}
                    </ReactMarkdown>
                )}
            </div>
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
