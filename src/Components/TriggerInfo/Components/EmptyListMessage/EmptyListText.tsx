import React, { FC } from "react";
import { Center } from "@skbkontur/react-ui/components/Center";
import classNames from "classnames/bind";

import styles from "./EmptyListText.module.less";

const cn = classNames.bind(styles);

interface IEmptyListTextProps {
    text: string;
}

export const EmptyListText: FC<IEmptyListTextProps> = ({ text }) => (
    <Center>
        <span className={cn("text")}>{text}</span>
    </Center>
);
