// @flow
import * as React from "react";
import Media from "react-media";

type DesktopProps = {
    children: boolean => React.Node,
};

export default function Desktop({ children }: DesktopProps): React.Node {
    return <Media query={{ minWidth: 599 }}>{matches => children(matches)}</Media>;
}
