import type { ReactElement } from "react";
import { Link as ReactRouterLink, LinkProps as RouterLinkProps } from "react-router";
import { Link as KonturLink } from "@skbkontur/react-ui";
import type { LinkProps as KonturLinkProps } from "@skbkontur/react-ui/components/Link/Link";

export interface IRouterLinkProps extends Omit<RouterLinkProps, "ref"> {
    icon?: ReactElement | undefined;
}

export default function RouterLink({
    icon,
    children,
    ...rest
}: IRouterLinkProps): ReactElement<KonturLinkProps> {
    return (
        <KonturLink component={ReactRouterLink} icon={icon} {...rest}>
            {children}
        </KonturLink>
    );
}
