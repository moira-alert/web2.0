import React, { ReactNode, FC } from "react";
import classNames from "classnames/bind";

import styles from "./MessageWrapper.less";

const cn = classNames.bind(styles);

interface IMessageWrapperProps {
    children: ReactNode;
    message: string;
    width?: string;
    shouldApplyWrapper?: boolean;
}

export const MessageWrapper: FC<IMessageWrapperProps> = ({
    children,
    message,
    width,
    shouldApplyWrapper,
}) => {
    return shouldApplyWrapper ? (
        <div style={{ width }} className={cn("wrapper")}>
            {children}
            {shouldApplyWrapper && <p>{message}</p>}
        </div>
    ) : (
        <>{children}</>
    );
};
