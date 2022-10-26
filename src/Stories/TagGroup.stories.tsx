import React from "react";
import { action } from "@storybook/addon-actions";
import TagGroup from "../Components/TagGroup/TagGroup";

export default {
    title: "TagGroup",
    component: TagGroup,
};

const tags = ["abonentsErrors", "dmitry:ReplicaClusterError.ReplicaClusterWarn", "test"];

export const Default = () => <TagGroup tags={tags} />;

export const WithRemove = () => <TagGroup tags={tags} onRemove={action("onRemove")} />;
