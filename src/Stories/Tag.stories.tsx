import React from "react";
import { action } from "@storybook/addon-actions";
import Tag from "../Components/Tag/Tag";
import NewTagBadge from "../Components/NewTagBadge/NewTagBadge";

export default {
    title: "Tag",
    creevey: {
        skip: {
            stories: "NewTagBadge with remove",
            reasons: "Unstable draw button angles with border-radius",
        },
    },
    decorators: [(story: () => JSX.Element) => <div style={{ padding: 5 }}>{story()}</div>],
};

export const Default = () => <Tag title="abonentsErrors" />;

export const LongTitle = () => <Tag title="dmitry:ReplicaClusterError.ReplicaClusterWarn" />;

export const ShortTitle = () => <Tag title="test" />;

export const WithOnClick = () => <Tag title="abonentsErrors" onClick={action("onClick")} />;

export const WithOnRemove = () => <Tag title="ReplicaClusterWarn" onRemove={action("onRemove")} />;

export const WithOnClickAndOnRemove = () => (
    <Tag title="ReplicaClusterError" onClick={action("onClick")} onRemove={action("onRemove")} />
);

export const Focused = () => (
    <Tag
        title="ReplicaClusterError"
        focus
        onClick={action("onClick")}
        onRemove={action("onRemove")}
    />
);

export const NewTag = () => <NewTagBadge title="ReplicaClusterError" onClick={action("onClick")} />;

export const NewTagBadgeFocused = () => (
    <NewTagBadge title="ReplicaClusterError" focus onClick={action("onClick")} />
);

export const NewTagBadgeWithRemove = () => (
    <NewTagBadge
        title="ReplicaClusterError"
        onClick={action("onClick")}
        onRemove={action("onRemove")}
    />
);
