import React, { FocusEventHandler, ReactNode } from "react";
import { useElementSize } from "../../../hooks/useElementSize";
import { Popup } from "@skbkontur/react-ui/internal/Popup";
import { ScrollContainer } from "@skbkontur/react-ui/components/ScrollContainer";

import styles from "../TagDropdownSelect.module.less";

interface ITagDropdownProps {
    anchor: HTMLElement | null;
    children: ReactNode;
    maxHeight?: number;
    onBlur?: FocusEventHandler<HTMLDivElement>;
}
export const TagDropdown: React.FC<ITagDropdownProps> = ({
    anchor,
    children,
    maxHeight = 300,
    onBlur,
}) => {
    const { width } = useElementSize(anchor);

    if (!anchor) return null;

    return (
        <Popup
            margin={2}
            hasShadow
            anchorElement={anchor}
            opened
            pos="bottom left"
            positions={["top left", "bottom left"]}
            style={{ width }}
            className={styles.popup}
        >
            <div className={styles.dropdown} onBlur={onBlur}>
                <ScrollContainer maxHeight={maxHeight}>{children}</ScrollContainer>
            </div>
        </Popup>
    );
};
