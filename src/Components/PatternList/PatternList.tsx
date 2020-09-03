import * as React from "react";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import { Button } from "@skbkontur/react-ui/components/Button";
import TrashIcon from "@skbkontur/react-icons/Trash";
import { Pattern } from "../../Domain/Pattern";
import { getPageLink } from "../../Domain/Global";
import RouterLink from "../RouterLink/RouterLink";
import cn from "./PatternList.less";

export type SortingColumn = "metric" | "trigger";

type Props = {
    items: Array<Pattern>;
    onRemove: (pattern: string) => void;
    sortingColumn: SortingColumn;
    sortingDown?: boolean;
    onSort?: (sorting: SortingColumn) => void;
};

export default function PatternList(props: Props): React.ReactNode {
    const { items, onRemove, sortingColumn, sortingDown, onSort } = props;
    const sortingIcon = sortingDown ? <ArrowBoldDownIcon /> : <ArrowBoldUpIcon />;
    return (
        <div>
            <div className={cn("row", "header")}>
                <div className={cn("name")}>Pattern</div>
                <button
                    type="button"
                    className={cn("trigger-counter", { sorting: onSort })}
                    onClick={onSort && (() => onSort("trigger"))}
                >
                    Triggers{" "}
                    {sortingColumn === "trigger" && (
                        <span className={cn("icon")}>{sortingIcon}</span>
                    )}
                </button>
                <button
                    type="button"
                    className={cn("metric-counter", { sorting: onSort })}
                    onClick={onSort && (() => onSort("metric"))}
                >
                    Metric{" "}
                    {sortingColumn === "metric" && (
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
type ItemState = {
    showInfo: boolean;
};

class PatternListItem extends React.Component<ItemProps, ItemState> {
    state: ItemState = {
        showInfo: false,
    };

    render(): React.ReactNode {
        const { data, onRemove } = this.props;
        const { pattern, triggers, metrics } = data;
        const { showInfo } = this.state;
        const isTriggers = triggers.length !== 0;
        const isMetrics = metrics.length !== 0;
        return (
            <div className={cn("row", { active: showInfo, clicable: isTriggers || isMetrics })}>
                {isTriggers || isMetrics ? (
                    <button
                        type="button"
                        className={cn("name", "clicked")}
                        onClick={() => this.setState({ showInfo: !showInfo })}
                    >
                        {pattern}
                    </button>
                ) : (
                    <div className={cn("name")}>{pattern}</div>
                )}
                <div className={cn("trigger-counter")}>{triggers.length}</div>
                <div className={cn("metric-counter")}>{metrics.length}</div>
                <div className={cn("control")}>
                    <Button use="link" icon={<TrashIcon />} onClick={() => onRemove()}>
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
                                        <RouterLink to={getPageLink("trigger", id)}>
                                            {name}
                                        </RouterLink>
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
    }
}
