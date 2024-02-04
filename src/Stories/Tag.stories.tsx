import * as React from "react";
import { action } from "@storybook/addon-actions";
import Tag from "../Components/Tag/Tag";
import NewTagBadge from "../Components/NewTagBadge/NewTagBadge";
import { Meta } from "@storybook/react";

const meta: Meta<typeof Tag> = {
    title: "Tag",
    decorators: [(story) => <div style={{ padding: 5 }}>{story()}</div>],
};

export const Default = { render: () => <Tag title="abonentsErrors" /> };

export const LongTitle = {
    render: () => <Tag title="dmitry:ReplicaClusterError.ReplicaClusterWarn" />,
};

export const ShortTitle = { render: () => <Tag title="test" /> };

export const WithOnClick = {
    render: () => <Tag title="abonentsErrors" onClick={action("onClick")} />,
};

export const WithOnRemove = {
    render: () => <Tag title="ReplicaClusterWarn" onRemove={action("onRemove")} />,
};

export const WithOnClickAndOnRemove = {
    render: () => (
        <Tag
            title="ReplicaClusterError"
            onClick={action("onClick")}
            onRemove={action("onRemove")}
        />
    ),
};

export const Focused = {
    render: () => (
        <Tag
            title="ReplicaClusterError"
            focus
            onClick={action("onClick")}
            onRemove={action("onRemove")}
        />
    ),
};

export const _NewTagBadge = {
    render: () => <NewTagBadge title="ReplicaClusterError" onClick={action("onClick")} />,
};

export const NewTagBadgeFocused = {
    render: () => <NewTagBadge title="ReplicaClusterError" focus onClick={action("onClick")} />,
};

export const NewTagBadgeWithRemove = {
    render: () => (
        <NewTagBadge
            title="ReplicaClusterError"
            onClick={action("onClick")}
            onRemove={action("onRemove")}
        />
    ),
};

export default meta;
