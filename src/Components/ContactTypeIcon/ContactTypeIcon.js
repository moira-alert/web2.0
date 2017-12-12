// @flow
import * as React from "react";
import Icon from "retail-ui/components/Icon";
import SvgIcon from "../SvgIcon/SvgIcon";
import PushoverLogo from "./pushover-logo.svg";
import SlackLogo from "./slack-logo.svg";
import TwilioLogo from "./twilio-logo.svg";

type Props = {
    type: string,
};

export default function ContactTypeIcon({ type }: Props): React.Element<any> {
    if (type === "telegram") {
        return <Icon name={"Telegram2"} />;
    }
    if (type.includes("phone")) {
        return <Icon name={"DeviceSmartphone"} />;
    }
    if (type === "pushover") {
        return <SvgIcon path={PushoverLogo} size={14} offsetTop={2} />;
    }
    if (type === "slack") {
        return <SvgIcon path={SlackLogo} size={15} offsetTop={2} />;
    }
    if (type === "twilio voice") {
        return <SvgIcon path={TwilioLogo} size={14} offsetTop={2} />;
    }
    if (type === "twilio sms") {
        return <SvgIcon path={TwilioLogo} size={14} offsetTop={2} />;
    }
    if (type.includes("sms")) {
        return <Icon name={"DeviceSmartphone"} />;
    }
    if (type.includes("mail")) {
        return <Icon name={"Mail2"} />;
    }
    return <Icon name={"Mail2"} />;
}
