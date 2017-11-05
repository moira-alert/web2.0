// @flow
import * as React from "react";
import Select from "retail-ui/components/Select";
import StatusIcon from "../StatusIcon/StatusIcon";
import { getStatusCaption, type Status } from "../../Domain/Status";
import { RowStack, Fit } from "../ItemsStack/ItemsStack";

type Props = {|
    value: Status,
    availableStatuses: Array<Status>,
    onChange: Status => void,
|};

function renderItem(value: Status, item: string): React.Node {
    return (
        <RowStack baseline block gap={2}>
            <Fit>
                <StatusIcon status={value} />
            </Fit>
            <Fit>{item}</Fit>
        </RowStack>
    );
}

export default function StatusSelect(props: Props): React.Node {
    const { availableStatuses, value, onChange } = props;

    return (
        <Select
            width={130}
            value={value}
            renderItem={renderItem}
            renderValue={renderItem}
            items={availableStatuses.map(x => [x, getStatusCaption(x)])}
            onChange={(e, value: Status) => onChange(value)}
        />
    );
}
