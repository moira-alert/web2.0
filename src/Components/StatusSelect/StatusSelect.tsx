import * as React from "react";
import { Select } from "@skbkontur/react-ui/components/Select";
import StatusIcon from "../StatusIcon/StatusIcon";
import { getStatusCaption, StatusesCaptions, Status } from "../../Domain/Status";
import { RowStack, Fit } from "../ItemsStack/ItemsStack";

type Props = {
    value: Status;
    availableStatuses: Array<Status>;
    onChange: (status: Status) => void;
};

function renderItem(value: Status, item: string | null | undefined): React.ReactElement {
    return (
        <RowStack baseline block gap={2}>
            <Fit>
                <StatusIcon status={value} />
            </Fit>
            <Fit>{item}</Fit>
        </RowStack>
    );
}

export default function StatusSelect(props: Props): React.ReactElement {
    const { availableStatuses, value, onChange } = props;

    return (
        <Select<Status, StatusesCaptions>
            width={130}
            value={value}
            renderItem={renderItem}
            renderValue={renderItem}
            items={availableStatuses.map((x) => [x, getStatusCaption(x)])}
            onValueChange={(v: Status) => onChange(v)}
        />
    );
}
