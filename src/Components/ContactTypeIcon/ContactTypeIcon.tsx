import React, { useState, useLayoutEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import { ConfigState } from "../../store/selectors";
import { icons } from "./ContactIcons";
import { useTheme } from "../../Themes";

type Props = {
    type: string;
};

export default function ContactTypeIcon({ type }: Props): React.ReactElement | null {
    const { config } = useAppSelector(ConfigState);

    const contact = config?.contacts.find((contact) => type.includes(contact.type));

    const [iconKey, setIconKey] = useState<string | null>(null);
    const theme = useTheme();

    useLayoutEffect(() => {
        if (contact?.logo_uri) {
            const keyword = contact.logo_uri.split("-")[0].toLowerCase();
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

    return (
        <div
            style={{
                display: "inline-block",
                position: "relative",
                top: "2px",
            }}
        >
            <IconComponent color={theme.textColorDefault} size={16} />
        </div>
    );
}
