import type { ReactNode, ReactElement } from "react";
import classNames from "classnames/bind";

import styles from "./A11yButtonWrapper.module.less";

const cn = classNames.bind(styles);

type Props = {
    children: ReactNode;
    onClick: () => void;
};

/**
 * Обёртка, чтобы кликабельные элементы были доступны
 */
export default function A11yButtonWrapper(props: Props): ReactElement {
    const { children, ...rest } = props;
    return (
        <button className={cn("wrapper")} type="button" {...rest}>
            {children}
        </button>
    );
}
