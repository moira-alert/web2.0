// @flow
import * as React from "react";
import Button from "retail-ui/components/Button";
import TrashIcon from "@skbkontur/react-icons/Trash";
import type { Pattern } from "../../Domain/Pattern";
import { getPageLink } from "../../Domain/Global";
import RouterLink from "../RouterLink/RouterLink";
import cn from "./PatternList.less";

type Props = $Exact<{
    items: Array<Pattern>,
    onRemove: (pattern: string) => void,
}>;

export default class PatternList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: this.props.items.slice(0, 1)
        }
    }

    updateItemList = () => {
        setTimeout(() => {
            let hasMoreItems = this.state.items.length + 1 < this.props.items.length;
            this.setState((prev, props) => ({
                items: props.items.slice(0, prev.items.length + 1)
            }));
            if (hasMoreItems) {this.updateItemList()}
        }, 0)
    };

    componentDidMount() {
        this.updateItemList()
    };

    render() {
        return (
            <div>
                <div className={cn("row", "header")}>
                    <div className={cn("name")}>Pattern</div>
                    <div className={cn("trigger-counter")}>Triggers</div>
                    <div className={cn("metric-counter")}>Metrics</div>
                    <div className={cn("control")}/>
                </div>
                {this.state.items.map(item => (
                    <PatternListItem
                        key={item.pattern}
                        data={item}
                        onRemove={() => this.props.onRemove(item.pattern)}
                    />
                ))}
            </div>
        );
    }
}

type ItemProps = {
    data: Pattern,
    onRemove: () => void,
};
type ItemState = {
    showInfo: boolean,
};

class PatternListItem extends React.Component<ItemProps, ItemState> {
    props: ItemProps;

    state: ItemState = {
        showInfo: false,
    };

    render(): React.Node {
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
                                {metrics.map(metric => (
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
