import * as React from "react";
import { action } from "@storybook/addon-actions";
import TagGroup from "../Components/TagGroup/TagGroup";

const tags = ["abonentsErrors", "dmitry:ReplicaClusterError.ReplicaClusterWarn", "test"];

export default {
    title: "TagGroup",
};

export const Default = () => <TagGroup tags={tags} />;
export const WithRemove = () => <TagGroup tags={tags} onRemove={action("onRemove")} />;
