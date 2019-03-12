// @flow
import * as React from "react";
import Input from "retail-ui/components/Input";
import Select from "retail-ui/components/Select";
import { ValidationWrapperV1, tooltip, type ValidationInfo } from "react-ui-validations";
import Remarkable from "remarkable";
import type { ContactConfig } from "../../Domain/Config";
import validateContact from "../../helpers/ContactValidator";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import cn from "./ContactEditForm.less";

const md = new Remarkable({ breaks: true });

export type ContactInfo = {
    type: ?string,
    value: string,
};

export type ContactInfoUpdate = {
    type: string,
    value: string,
};

type Props = $Exact<{
    contactDescriptions: Array<ContactConfig>,
    contactInfo: ContactInfo,
    onChange: ($Shape<ContactInfoUpdate>) => void,
}>;

export default class ContactEditForm extends React.Component<Props> {
    props: Props;

    render(): React.Node {
        const { onChange, contactInfo, contactDescriptions } = this.props;
        const { value, type } = contactInfo;
        const currentContactConfig = contactDescriptions.find(contact => contact.type === type);
        const contactItems = contactDescriptions.map(contact => [contact.type, contact.label]);

        return (
            <div className={cn("form")}>
                <div className={cn("row")}>
                    <Select
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
                        onChange={(evt, v) => {
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
                            onChange={(e, v) => onChange({ value: v })}
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
        const { value, type } = contactInfo;
        const currentContactConfig = contactDescriptions.find(x => x.type === type);
        if (type == null || currentContactConfig == null) {
            return null;
        }
        return validateContact(currentContactConfig, value);
    }
}
