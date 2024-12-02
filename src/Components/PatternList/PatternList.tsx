import React, { useState, FC } from "react";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import { Button } from "@skbkontur/react-ui/components/Button";
import TrashIcon from "@skbkontur/react-icons/Trash";
import { Pattern } from "../../Domain/Pattern";
import { getPageLink } from "../../Domain/Global";
import RouterLink from "../RouterLink/RouterLink";
import { ISortConfig } from "../../hooks/useSortData";
import { useTheme } from "../../Themes";
import classNames from "classnames/bind";

import styles from "./PatternList.less";

const cn = classNames.bind(styles);

type SortingColumn = "metrics" | "triggers";

type Props = {
    items: Array<Pattern>;
    sortConfig: ISortConfig;
    onRemove: (pattern: string) => void;
    onSort?: (sorting: SortingColumn) => void;
};

export default function PatternList(props: Props): React.ReactElement {
    const {
        items,
        sortConfig: { sortingColumn, direction },
        onRemove,
        onSort,
    } = props;
    const sortingIcon = direction === "desc" ? <ArrowBoldDownIcon /> : <ArrowBoldUpIcon />;
    return (
        <div>
            <div className={cn("row", "header", "italic-font")}>
                <div className={cn("name")}>Pattern</div>
                <button
                    type="button"
                    className={cn("trigger-counter", { sorting: onSort })}
                    onClick={onSort && (() => onSort("triggers"))}
                >
                    Triggers{" "}
                    {sortingColumn === "triggers" && (
                        <span className={cn("icon")}>{sortingIcon}</span>
                    )}
                </button>
                <button
                    type="button"
                    className={cn("metric-counter", { sorting: onSort })}
                    onClick={onSort && (() => onSort("metrics"))}
                >
                    Metric{" "}
                    {sortingColumn === "metrics" && (
                        <span className={cn("icon")}>{sortingIcon}</span>
                    )}
                </button>
                <div className={cn("control")} />
            </div>
            {items.map((item) => (
                <PatternListItem
                    key={item.pattern}
                    data={item}
                    onRemove={() => onRemove(item.pattern)}
                />
            ))}
        </div>
    );
}

type ItemProps = {
    data: Pattern;
    onRemove: () => void;
};

const PatternListItem: FC<ItemProps> = ({ data, onRemove }) => {
    const { pattern, triggers, metrics } = data;
    const [showInfo, setShowInfo] = useState(false);
    const [hover, setHover] = useState(false);
    const theme = useTheme();

    const isTriggers = triggers.length !== 0;
    const isMetrics = metrics.length !== 0;

    const hoverStyle = {
        backgroundColor: hover ? theme.itemHover : theme.appBgColorPrimary,
    };
    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={hoverStyle}
            className={cn("row", { active: showInfo, clicable: isTriggers || isMetrics })}
        >
            {isTriggers || isMetrics ? (
                <button
                    style={{ color: theme.textColorDefault }}
                    type="button"
                    className={cn("name", "clicked")}
                    onClick={() => setShowInfo(!showInfo)}
                >
                    {pattern}
                </button>
            ) : (
                <div className={cn("name")}>{pattern}</div>
            )}
            <div className={cn("trigger-counter")}>{triggers.length}</div>
            <div className={cn("metric-counter")}>{metrics.length}</div>
            <div className={cn("control")}>
                <Button use="link" icon={<TrashIcon />} onClick={onRemove}>
                    Delete
                </Button>
            </div>
            {showInfo && (
                <div className={cn("info")}>
                    {isTriggers && (
                        <div className={cn("group")}>
                            <b>Triggers</b>
                            {triggers.map(({ id, name }) => (
                                <div key={id} className={cn("item")}>
                                    <RouterLink to={getPageLink("trigger", id)}>{name}</RouterLink>
                                </div>
                            ))}
                        </div>
                    )}
                    {isMetrics && (
                        <div className={cn("group")}>
                            <b>Metrics</b>
                            {metrics.map((metric) => (
                                <div key={metric} className={cn("item")}>
                                    {metric}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
