import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import TagGroup from "../Components/TagGroup/TagGroup";

const tags = ["abonentsErrors", "dmitry:ReplicaClusterError.ReplicaClusterWarn", "test"];

storiesOf("TagGroup", module)
    .add("Default", () => <TagGroup tags={tags} />)
    .add("With remove", () => <TagGroup tags={tags} onRemove={action("onRemove")} />);
