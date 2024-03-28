import * as React from "react";
import TelegramIcon from "@skbkontur/react-icons/Telegram2";
import MailIcon from "@skbkontur/react-icons/Mail2";
import FacebookIcon from "@skbkontur/react-icons/Facebook2";
import TwitterIcon from "@skbkontur/react-icons/Twitter2";
import PhoneIcon from "@skbkontur/react-icons/Phone2";
import WhatsappIcon from "@skbkontur/react-icons/WhatsApp2";
import ViberIcon from "@skbkontur/react-icons/Viber2";
import SvgIcon from "../SvgIcon/SvgIcon";
import PushoverLogo from "./pushover-logo.svg";
import SlackLogo from "./slack-logo.svg";
import MsTeamsLogo from "./msteams-logo.svg";
import WebhookLogo from "./webhook-logo.svg";
import DiscordLogo from "./discord-logo.svg";
import PagerdutyLogo from "./pagerduty-logo.svg";
import VictoropsLogo from "./victorops-logo.svg";
import OpsgenieLogo from "./opsgenie-logo.svg";
import MattermostLogo from "./mattermost-logo.svg";
import SMSLogo from "./sms-logo.svg";

type Props = {
    type: string;
};

const TypeToIcon: { [key: string]: React.ReactElement } = {
    slack: <SvgIcon path={SlackLogo} size={15} offsetTop={2} />,
    msteams: <SvgIcon path={MsTeamsLogo} size={15} offsetTop={2} />,
    telegram: <TelegramIcon />,
    facebook: <FacebookIcon />,
    viber: <ViberIcon />,
    whatsapp: <WhatsappIcon />,
    twitter: <TwitterIcon />,
    mail: <MailIcon />,
    email: <MailIcon />,
    pushover: <SvgIcon path={PushoverLogo} size={14} offsetTop={2} />,
    twilio: <PhoneIcon />,
    webhook: <SvgIcon path={WebhookLogo} size={14} offsetTop={2} />,
    discord: <SvgIcon path={DiscordLogo} size={14} offsetTop={2} />,
    pagerduty: <SvgIcon path={PagerdutyLogo} size={14} offsetTop={2} />,
    victorops: <SvgIcon path={VictoropsLogo} size={14} offsetTop={2} />,
    opsgenie: <SvgIcon path={OpsgenieLogo} size={14} offsetTop={2} />,
    mattermost: <SvgIcon path={MattermostLogo} size={14} offsetTop={2} />,
    phone: <SvgIcon path={SMSLogo} size={14} offsetTop={2} />,
    tel: <PhoneIcon />,
    sms: <PhoneIcon />,
};

export default function ContactTypeIcon({ type }: Props): React.ReactElement {
    const iconKey = Object.keys(TypeToIcon).find((key) => type.includes(key));
    return iconKey ? TypeToIcon[iconKey] : <MailIcon />;
}
