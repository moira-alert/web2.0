import React from "react";
import TelegramLogo from "./telegram-logo.svg";
import MailLogo from "./mail-logo.svg";
import FacebookLogo from "./facebook-logo.svg";
import TwitterLogo from "./twitter-logo.svg";
import PhoneLogo from "./phone-logo.svg";
import WhatsappLogo from "./whatsapp-logo.svg";
import ViberLogo from "./viber-logo.svg";
import SvgIcon from "../SvgIcon/SvgIcon";
import PushoverLogo from "./pushover-logo.svg";
import SlackLogo from "./slack-logo.svg";
import MsTeamsLogo from "./msteams-logo.svg";
import TwilioLogo from "./twilio-logo.svg";
import WebhookLogo from "./webhook-logo.svg";
import DiscordLogo from "./discord-logo.svg";
import PagerdutyLogo from "./pagerduty-logo.svg";
import VictoropsLogo from "./victorops-logo.svg";
import OpsgenieLogo from "./opsgenie-logo.svg";
import MattermostLogo from "./mattermost-logo.svg";

export const DefaultTypeToIcon: { [key: string]: React.ReactElement } = {
    slack: <SvgIcon path={SlackLogo} size={15} offsetTop={2} />,
    msteams: <SvgIcon path={MsTeamsLogo} size={15} offsetTop={2} />,
    telegram: <SvgIcon path={TelegramLogo} size={14} offsetTop={2} />,
    facebook: <SvgIcon path={FacebookLogo} size={14} offsetTop={2} />,
    viber: <SvgIcon path={ViberLogo} size={14} offsetTop={2} />,
    whatsapp: <SvgIcon path={WhatsappLogo} size={14} offsetTop={2} />,
    twitter: <SvgIcon path={TwitterLogo} size={14} offsetTop={2} />,
    mail: <SvgIcon path={MailLogo} size={14} offsetTop={2} />,
    email: <SvgIcon path={MailLogo} size={14} offsetTop={2} />,
    pushover: <SvgIcon path={PushoverLogo} size={14} offsetTop={2} />,
    twilio: <SvgIcon path={TwilioLogo} size={14} offsetTop={2} />,
    webhook: <SvgIcon path={WebhookLogo} size={14} offsetTop={2} />,
    discord: <SvgIcon path={DiscordLogo} size={14} offsetTop={2} />,
    pagerduty: <SvgIcon path={PagerdutyLogo} size={14} offsetTop={2} />,
    victorops: <SvgIcon path={VictoropsLogo} size={14} offsetTop={2} />,
    opsgenie: <SvgIcon path={OpsgenieLogo} size={14} offsetTop={2} />,
    mattermost: <SvgIcon path={MattermostLogo} size={14} offsetTop={2} />,
    phone: <SvgIcon path={PhoneLogo} size={14} offsetTop={2} />,
    tel: <SvgIcon path={PhoneLogo} size={14} offsetTop={2} />,
    sms: <SvgIcon path={PhoneLogo} size={14} offsetTop={2} />,
};
