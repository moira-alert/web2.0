// @flow
import * as React from "react";
import cn from "./Bar.less";
import Icon from "retail-ui/components/Icon";

type Props = {|
    message: string,
|};

export default function Bar(props: Props): React.Node {
    const { message } = props;
    return (
        <div className={cn('wrap')}>
            <Icon name='Warning'/> { message }
        </div>
    )
}
