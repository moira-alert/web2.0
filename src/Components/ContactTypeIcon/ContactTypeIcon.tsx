import React, { useState, useLayoutEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import { ConfigState } from "../../store/selectors";
import { icons } from "./ContactIcons";
import { useTheme } from "../../Themes";
import { getStatusColor, Status } from "../../Domain/Status";
import classNames from "classnames/bind";

import styles from "./ContactTypeIcon.module.less";

const cn = classNames.bind(styles);

type Props = {
    type: string;
    isError?: boolean;
};

export default function ContactTypeIcon({ type, isError }: Props): React.ReactElement | null {
    const { config } = useAppSelector(ConfigState);

    const contact = config?.contacts.find((contact) => type.includes(contact.type));

    const [iconKey, setIconKey] = useState<string | null>(null);
    const theme = useTheme();

    useLayoutEffect(() => {
        if (contact?.logo_uri) {
            const keyword = contact.logo_uri.toLowerCase();
            const matchingIcon = Object.keys(icons).find((name) =>
                name.toLowerCase().includes(keyword)
            );
            if (matchingIcon) {
                setIconKey(matchingIcon);
                return;
            }
        }

        if (type in icons) {
            setIconKey(type);
        } else {
            setIconKey("mail");
        }
    }, [contact?.logo_uri]);

    if (!iconKey) return null;

    const IconComponent = icons[iconKey];

    const color = isError ? getStatusColor(Status.EXCEPTION) : theme.textColorDefault;

    return (
        <div className={cn("icon", { error: isError })}>
            <IconComponent color={color} size={16} />
        </div>
    );
}
