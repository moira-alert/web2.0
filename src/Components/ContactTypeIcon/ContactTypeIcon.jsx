// @flow
import * as React from "react";
import TelegramIcon from "@skbkontur/react-icons/Telegram2";
import DeviceSmartphoneIcon from "@skbkontur/react-icons/DeviceSmartphone";
import MailIcon from "@skbkontur/react-icons/Mail2";
import { ContactTypes } from "../../Domain/ContactType";
import SvgIcon from "../SvgIcon/SvgIcon";
import PushoverLogo from "./pushover-logo.svg";
import SlackLogo from "./slack-logo.svg";
import TwilioLogo from "./twilio-logo.svg";

type Props = {
    type: string,
};

export default function ContactTypeIcon({ type }: Props): React.Element<any> {
    if (type === ContactTypes.telegram) {
        return <TelegramIcon />;
    }
    if (type.includes("phone")) {
        return <DeviceSmartphoneIcon />;
    }
    if (type === ContactTypes.pushover) {
        return <SvgIcon path={PushoverLogo} size={14} offsetTop={2} />;
    }
    if (type === ContactTypes.slack) {
        return <SvgIcon path={SlackLogo} size={15} offsetTop={2} />;
    }
    if (type === ContactTypes["twilio voice"]) {
        return <SvgIcon path={TwilioLogo} size={14} offsetTop={2} />;
    }
    if (type === ContactTypes["twilio sms"]) {
        return <SvgIcon path={TwilioLogo} size={14} offsetTop={2} />;
    }
    if (type.includes("sms")) {
        return <DeviceSmartphoneIcon />;
    }
    if (type.includes("mail")) {
        return <MailIcon />;
    }
    return <MailIcon />;
}
