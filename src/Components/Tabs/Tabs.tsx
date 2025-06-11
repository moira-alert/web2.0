import React, { useState, useEffect } from "react";
import { Tabs } from "@skbkontur/react-ui/components/Tabs";
import classNames from "classnames/bind";

import styles from "./Tabs.module.less";

const cn = classNames.bind(styles);

interface ITabsCustomProps {
    value: string;
    children: Array<React.ReactElement | null>;
    onValueChange?: (tab: string) => void;
}

interface ITabProps {
    id: string;
    label: string;
    children: React.ReactNode;
}

const TabsCustom: React.FC<ITabsCustomProps> = ({ value, children, onValueChange }) => {
    const [activeTab, setActiveTab] = useState<string>(value);

    useEffect(() => {
        setActiveTab(value);
    }, [value]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (onValueChange) {
            onValueChange(value);
        }
    };

    if (React.Children.toArray(children).filter(Boolean).length === 0) {
        return <div />;
    }
    if (React.Children.toArray(children).filter(Boolean).length === 1) {
        return <div>{children}</div>;
    }

    return (
        <div>
            <div className={cn("header")}>
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    {React.Children.map(children, (child) =>
                        child ? <Tabs.Tab id={child.props.id}>{child.props.label}</Tabs.Tab> : null
                    )}
                </Tabs>
            </div>
            {(React.Children.toArray(children) as React.ReactElement[]).filter(
                ({ props }) => props.id === activeTab
            )}
        </div>
    );
};

export const Tab: React.FC<ITabProps> = ({ children }) => <div>{children}</div>;

export default TabsCustom;
