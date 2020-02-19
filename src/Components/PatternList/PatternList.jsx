// @flow
import * as React from "react";
import cn from "./PatternList.less";
import PatternListItem from "../PatternListItem/PatternListItem";

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
        const { onRemove } = this.props;
        return (
            <div>
                <div className={cn("row", "header")}>
                    <div className={cn("name")}>Pattern</div>
                    <div className={cn("trigger-counter")}>Triggers</div>
                    <div className={cn("metric-counter")}>Metrics</div>
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

    updateItemList = () => {
        const { patternItems } = this.state;
        const { items } = this.props;
        setTimeout(() => {
            const hasMoreItems = patternItems.length + 1 < items.length;
            this.setState((prev, props) => ({
                patternItems: props.items.slice(0, prev.patternItems.length + 1),
            }));
            if (hasMoreItems) this.updateItemList();
        }, 0);
    };
}
