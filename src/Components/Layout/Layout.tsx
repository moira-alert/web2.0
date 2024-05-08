import React, { useRef, ReactNode, FC, useEffect } from "react";
import { Loader } from "@skbkontur/react-ui/components/Loader";
import WarningIcon from "@skbkontur/react-icons/Warning";
import { Toast } from "@skbkontur/react-ui/components/Toast";
import classNames from "classnames/bind";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import styles from "./Layout.less";

const cn = classNames.bind(styles);

interface ILayoutProps {
    children?: ReactNode;
    loading?: boolean;
    error?: string | null;
}

interface IBlockProps {
    children?: ReactNode;
    className?: string;
}

export const Block: FC<IBlockProps> = ({ children, className }) => (
    <div className={cn(className)}>
        <div className={cn("container")}>{children}</div>
    </div>
);

export const Layout: FC<ILayoutProps> = ({ loading = false, error = null, children }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { serviceWorkerUpdated } = useAppSelector(UIState);

    useEffect(() => {
        serviceWorkerUpdated &&
            Toast.push(
                "New version available, please, reload the page.",
                {
                    label: "Cancel",
                    handler: () => Toast.push("Canceled"),
                },
                1000 * 30
            );
    }, [serviceWorkerUpdated]);

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
            <Loader className={cn("loading")} active={loading} caption="Loading">
                {children}
            </Loader>
        </main>
    );
};

export const LayoutTitle: FC<IBlockProps> = ({ children, className }) => (
    <h1 className={cn("title", className)}>{children}</h1>
);

export const LayoutPlate: FC<IBlockProps> = ({ children, className }) => (
    <Block className={cn("grey-plate", className)}>{children}</Block>
);

export const LayoutContent: FC<IBlockProps> = ({ children, className }) => (
    <Block className={cn("content", className)}>{children}</Block>
);

export const LayoutFooter: FC<IBlockProps> = ({ children, className }) => (
    <Block className={cn("paging", className)}>{children}</Block>
);
