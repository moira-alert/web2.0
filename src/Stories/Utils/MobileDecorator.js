// @flow
import * as React from "react";
import cn from "./MobileDecorator.less";

function MobileContainer({ children }: { children: React.Node }): React.Node {
    return (
        <div className={cn("root")}>
            <div className={cn("container")}>{children}</div>
        </div>
    );
}

export default function MobileDecorator(story: () => React.Node): React.Node {
    return <MobileContainer>{story()}</MobileContainer>;
}
