// @flow
import * as React from "react";
import Icon from "retail-ui/components/Icon";
import cn from "./Bar.less";

type Props = {|
    message: string,
|};

export default function Bar(props: Props): React.Node {
    const { message } = props;
    return (
        <div className={cn("bar")}>
            <Icon name="Warning" /> {message}
        </div>
    );
}
