import * as React from "react";
import cn from "./A11yButtonWrapper.less";

type Props = {
    children: React.ReactNode;
    onClick: () => void;
};

/**
 * Обёртка, чтобы кликабельные элементы были доступны
 */
export default function A11yButtonWrapper(props: Props): React.ReactElement {
    const { children, ...rest } = props;
    return (
        <button className={cn("wrapper")} type="button" {...rest}>
            {children}
        </button>
    );
}
