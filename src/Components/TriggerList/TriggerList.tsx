import * as React from "react";
import { History } from "history";
import { Trigger } from "../../Domain/Trigger";
import TriggerListItem from "../TriggerListItem/TriggerListItem";
import classNames from "classnames/bind";

import styles from "./TriggerList.less";

const cn = classNames.bind(styles);

type Props = {
    items: Trigger[];
    searchMode: boolean;
    onChange: (triggerId: string, metric: string, maintenance: number) => void;
    onRemove: (triggerId: string, metric: string) => void;
    history: History;
};

export default function TriggerList(props: Props): React.ReactElement {
    const { items, searchMode, onChange, onRemove, history } = props;

    return (
        <div>
            {items.length === 0 ? (
                <div className={cn("no-result")}>No results :-(</div>
            ) : (
                items.map((item) => (
                    <div className={cn("item")} key={item.id}>
                        <TriggerListItem
                            searchMode={searchMode}
                            data={item}
                            onChange={(_triggerId: string, metric: string, maintenance: number) =>
                                onChange(item.id, metric, maintenance)
                            }
                            onRemove={(metric) => onRemove(item.id, metric)}
                            history={history}
                        />
                    </div>
                ))
            )}
        </div>
    );
}
