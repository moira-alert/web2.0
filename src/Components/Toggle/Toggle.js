// @flow
import * as React from 'react';
import Toggle from 'retail-ui/components/Toggle';
import cn from './Toggle.less';

type Props = {|
    checked?: boolean;
    label: string;
    onChange: (checked: boolean) => void;
|};

export default function ToggleWithLabel(props: Props): React.Element<any> {
    const { checked, label, onChange } = props;
    return (
        <span className={cn('toggle')} onClick={() => onChange(!checked)}>
            <Toggle checked={Boolean(checked)} /> {label}
        </span>
    );
}
