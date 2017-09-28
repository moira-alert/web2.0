// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'retail-ui/components/Button';
import type { Pattern } from '../../Domain/Pattern';
import { getPageLink } from '../../Domain/Global';
import cn from './PatternList.less';

type Props = {|
    items: Array<Pattern>;
    onRemove: (pattern: string) => void;
|};

export default function PatternList(props: Props): React.Element<*> {
    const { items, onRemove } = props;
    return (
        <div>
            <div className={cn('row', 'header')}>
                <div className={cn('name')}>Pattern</div>
                <div className={cn('trigger-counter')}>Triggers</div>
                <div className={cn('metric-counter')}>Metrics</div>
                <div className={cn('control')} />
            </div>
            {items.map((item, i) => <PatternListItem key={i} data={item} onRemove={() => onRemove(item.pattern)} />)}
        </div>
    );
}

type ItemProps = {
    data: Pattern;
    onRemove: () => void;
};
type ItemState = {|
    showInfo: boolean;
|};

class PatternListItem extends React.Component {
    props: ItemProps;
    state: ItemState = {
        showInfo: false,
    };
    render(): React.Element<*> {
        const { data, onRemove } = this.props;
        const { pattern, triggers, metrics } = data;
        const { showInfo } = this.state;
        const isTriggers = triggers.length !== 0;
        const isMetrics = metrics.length !== 0;
        return (
            <div className={cn('row', { active: showInfo, clicable: isTriggers || isMetrics })}>
                <div
                    className={cn('name')}
                    onClick={(isTriggers || isMetrics) && (() => this.setState({ showInfo: !showInfo }))}>
                    {pattern}
                </div>
                <div className={cn('trigger-counter')}>{triggers.length}</div>
                <div className={cn('metric-counter')}>{metrics.length}</div>
                <div className={cn('control')}>
                    <Button use='link' icon='Trash' onClick={() => onRemove()}>
                        Delete
                    </Button>
                </div>
                {showInfo && (
                    <div className={cn('info')}>
                        {isTriggers && (
                            <div className={cn('group')}>
                                <b>Triggers</b>
                                {triggers.map(({ id, name }) => (
                                    <div key={id} className={cn('item')}>
                                        <Link to={getPageLink('trigger', id)}>{name}</Link>
                                    </div>
                                ))}
                            </div>
                        )}
                        {isMetrics && (
                            <div className={cn('group')}>
                                <b>Metrics</b>
                                {metrics.map((metric, i) => (
                                    <div key={i} className={cn('item')}>
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
