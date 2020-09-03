import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { action } from "@storybook/addon-actions";
import Tag from "../Components/Tag/Tag";

export default {
    title: "Tag",
    decorators: [
        (story: () => ReactNode): ReactElement => <div style={{ padding: 5 }}>{story()}</div>,
    ],
};

export const Default: FunctionComponent = () => <Tag title="abonentsErrors" />;
export const LongTitle: FunctionComponent = () => (
    <Tag title="dmitry:ReplicaClusterError.ReplicaClusterWarn" />
);
export const ShortTitle: FunctionComponent = () => <Tag title="test" />;
export const WithOnClick: FunctionComponent = () => (
    <Tag title="abonentsErrors" onClick={action("onClick")} />
);
export const WithOnRemove: FunctionComponent = () => (
    <Tag title="ReplicaClusterWarn" onRemove={action("onRemove")} />
);
export const WithOnClickAndOnRemove: FunctionComponent = () => (
    <Tag title="ReplicaClusterError" onClick={action("onClick")} onRemove={action("onRemove")} />
);
export const Focused: FunctionComponent = () => (
    <Tag
        title="ReplicaClusterError"
        focus
        onClick={action("onClick")}
        onRemove={action("onRemove")}
    />
);
