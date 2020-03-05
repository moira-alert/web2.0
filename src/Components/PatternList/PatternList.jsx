// @flow
import * as React from "react";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import cn from "./PatternList.less";
import PatternListItem from "../PatternListItem/PatternListItem";

export type SortingColumn = "metric" | "trigger";

export default class PatternList extends React.Component {
    constructor(props) {
        super(props);
        const { items } = this.props;
        this.state = {
            patternItems: items.slice(0, 1),
        };
    }

    componentDidMount() {
        this.updateItemList();
    }

    render() {
        const { patternItems } = this.state;
        const { onRemove, sortingColumn, sortingDown, onSort } = this.props;
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
                {patternItems.map(item => (
                    <PatternListItem
                        key={item.pattern}
                        data={item}
                        onRemove={() => onRemove(item.pattern)}
                    />
                ))}
            </div>
        );
    }

    updateItemList() {
        const { patternItems } = this.state;
        const { items } = this.props;
        setTimeout(() => {
            const hasMoreItems = patternItems.length + 1 < items.length;
            this.setState((prev, props) => ({
                patternItems: props.items.slice(0, prev.patternItems.length + 1),
            }));
            if (hasMoreItems) this.updateItemList();
        }, 0);
    }
}
