import React, { useRef, ReactNode, FC, useEffect, CSSProperties } from "react";
import { Loader } from "@skbkontur/react-ui/components/Loader";
import WarningIcon from "@skbkontur/react-icons/Warning";
import { NewVersionAvailableHint } from "../NewVersionAvailableHint/NewVersionAvailableHint";
import { SnowfallBackground } from "../SnowFall/SnowFall";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import classNames from "classnames/bind";

import styles from "./Layout.module.less";

const cn = classNames.bind(styles);

interface ILayoutProps {
    children?: ReactNode;
    loading?: boolean;
    error?: string | null;
}

interface IBlockProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
}

export const Block: FC<IBlockProps> = ({ children, className, style }) => (
    <div style={style} className={cn(className)}>
        <div className={cn("container")}>{children}</div>
    </div>
);

export const Layout: FC<ILayoutProps> = ({ loading = false, error = null, children }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { isChristmasMood } = useAppSelector(UIState);

    useEffect(() => {
        if (scrollRef.current) {
            const element = scrollRef.current;
            const elementRect = element.getBoundingClientRect();
            window.scrollBy({
                top: elementRect.bottom - window.innerHeight,
                behavior: "smooth",
            });
        }
    }, [error]);

    return (
        <main className={cn("layout")}>
            {error && (
                <div ref={scrollRef} className={cn("error")}>
                    <WarningIcon /> {error}
                </div>
            )}

            <Loader className={cn("loader")} active={loading} caption="Loading">
                {isChristmasMood && <SnowfallBackground topOffset={60} />}
                {children}
            </Loader>
            <NewVersionAvailableHint />
        </main>
    );
};

export const LayoutTitle: FC<IBlockProps> = ({ children, className }) => (
    <h1 className={cn("title", className)}>{children}</h1>
);

export const LayoutPlate: FC<IBlockProps> = ({ children, className }) => {
    return <Block className={cn("grey-plate", className)}>{children}</Block>;
};

export const LayoutContent: FC<IBlockProps> = ({ children, className }) => (
    <Block className={cn("content", className)}>{children}</Block>
);

export const LayoutFooter: FC<IBlockProps> = ({ children, className }) => (
    <Block className={cn("paging", className)}>{children}</Block>
);
