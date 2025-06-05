import * as React from "react";
import { Link as ReactRouterLink, LinkProps as RouterLinkProps } from "react-router-dom";
import { Link as KonturLink } from "@skbkontur/react-ui";
import type { LinkProps as KonturLinkProps } from "@skbkontur/react-ui/components/Link/Link";

type Props = {
    icon?: React.ReactElement | undefined;
} & Omit<RouterLinkProps, "ref">;

export default function RouterLink({
    icon,
    children,
    ...rest
}: Props): React.ReactElement<KonturLinkProps> {
    return (
        <KonturLink component={ReactRouterLink} icon={icon} {...rest}>
            {children}
        </KonturLink>
    );
}
