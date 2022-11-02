import React from "react";
import TrashIcon from "@skbkontur/react-icons/Trash";
import { Button } from "@skbkontur/react-ui/components/Button";
import cn from "../PatternList/PatternList.less";
import RouterLink from "../RouterLink/RouterLink";
import { getPageLink } from "../../Domain/Global";
import { Pattern } from "../../Domain/Pattern";

type ItemProps = {
    data: Pattern;
    onRemove: () => void;
};
type ItemState = {
    showInfo: boolean;
};

export default class PatternListItem extends React.Component<ItemProps, ItemState> {
    public state: ItemState = {
        showInfo: false,
    };

    public render(): JSX.Element {
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
