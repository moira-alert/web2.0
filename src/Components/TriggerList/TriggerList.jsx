// @flow
import * as React from "react";
import type { Trigger } from "../../Domain/Trigger";
import type { Maintenance } from "../../Domain/Maintenance";
import TriggerListItem from "../TriggerListItem/TriggerListItem";
import cn from "./TriggerList.less";

type Props = {|
    items: Array<Trigger>,
    searchMode: boolean,
    onChange?: (triggerId: string, maintenance: Maintenance, metric: string) => void,
    onRemove?: (triggerId: string, metric: string) => void,
|};

export default function TriggerList(props: Props): React.Node {
    const { items, searchMode, onChange, onRemove } = props;
    return (
        <div>
            {items.length === 0 ? (
                <div className={cn("no-result")}>No results :-(</div>
            ) : (
                items.map(item => (
                    <div className={cn("item")} key={item.id}>
                        <TriggerListItem
                            searchMode={searchMode}
                            data={item}
                            onChange={
                                onChange &&
                                ((maintenance, metric) => onChange(item.id, maintenance, metric))
                            }
                            onRemove={onRemove && (metric => onRemove(item.id, metric))}
                        />
                    </div>
                ))
            )}
        </div>
    );
}
