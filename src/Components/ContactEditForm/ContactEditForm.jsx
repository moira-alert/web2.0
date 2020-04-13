// @flow
import * as React from "react";
import { Input } from "@skbkontur/react-ui/components/Input";
import { Select } from "@skbkontur/react-ui/components/Select";
import { ValidationWrapperV1, tooltip, type ValidationInfo } from "@skbkontur/react-ui-validations";
import Remarkable from "remarkable";
import type { ContactConfig } from "../../Domain/Config";
import type { Contact } from "../../Domain/Contact";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import cn from "./ContactEditForm.less";

const md = new Remarkable({ breaks: true });

type Props = $Exact<{
    contactDescriptions: Array<ContactConfig>,
    contactInfo: $Shape<Contact> | null,
    onChange: ($Shape<Contact>) => void,
}>;

export default class ContactEditForm extends React.Component<Props> {
    props: Props;

    render(): React.Node {
        const { onChange, contactInfo, contactDescriptions } = this.props;
        const { value = "", type } = contactInfo || {};
        const currentContactConfig = contactDescriptions.find(contact => contact.type === type);
        const contactItems = contactDescriptions.map(contact => [contact.type, contact.label]);

        return (
            <div className={cn("form")}>
                <div className={cn("row")}>
                    <Select
                        placeholder="Select channel type"
                        width="100%"
                        value={type || null}
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
                        onValueChange={v => {
                            // ToDo разобраться, почему value может отсутствовать
                            v && onChange({ type: v }); // eslint-disable-line
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
                            onValueChange={v => onChange({ value: v })}
                        />
                    </ValidationWrapperV1>
                </div>
                {currentContactConfig && currentContactConfig.help && (
                    /* ToDo избавиться от dangerouslySetInnerHTML */
                    /* eslint-disable */
                    <div
                        dangerouslySetInnerHTML={{
                            __html: md.render(currentContactConfig.help),
                        }}
                        className={cn("row", "comment")}
                    />
                    /* eslint-enable */
                )}
            </div>
        );
    }

    validateValue(): ?ValidationInfo {
        const { contactInfo, contactDescriptions } = this.props;

        if (!contactInfo) {
            return null;
        }

        const { value = "", type } = contactInfo;
        const currentContactConfig = contactDescriptions.find(x => x.type === type);

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
