import React, { useState, useEffect } from "react";
import SvgIcon from "../SvgIcon/SvgIcon";
import MailLogo from "./mail-logo.svg";
import { useAppSelector } from "../../store/hooks";
import { ConfigState } from "../../store/selectors";
import { FallbackTypeToIcon } from "./FallbackTypeToIcon";

type Props = {
    type: string;
};

export default function ContactTypeIcon({ type }: Props): React.ReactElement {
    const { config } = useAppSelector(ConfigState);

    const contact = config?.contacts.find((contact) => type.includes(contact.type));

    const [svgPath, setSvgPath] = useState<string | null>(null);

    useEffect(() => {
        import(`./${contact?.logo_uri}`)
            .then((module) => {
                setSvgPath(module.default);
            })
            .catch((error) => {
                console.error(`Failed to load SVG: ${error.message}`);
                setSvgPath(null);
            });
    }, [contact?.logo_uri]);

    const fallBack = () => {
        const iconKey = Object.keys(FallbackTypeToIcon).find((key) => type.includes(key));
        return iconKey ? (
            FallbackTypeToIcon[iconKey]
        ) : (
            <SvgIcon path={MailLogo} size={16} offsetTop={3} />
        );
    };

    return svgPath ? <SvgIcon path={svgPath} size={16} offsetTop={3} /> : fallBack();
}
