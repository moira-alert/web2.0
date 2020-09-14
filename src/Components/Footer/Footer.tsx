import * as React from "react";
import cn from "./Footer.less";

type Props = {
    className?: string;
};

export default function Footer(props: Props): React.ReactElement {
    const { className } = props;
    return (
        <footer className={cn("footer", className)}>
            <div className={cn("container")}>© SKB Kontur</div>
        </footer>
    );
}
