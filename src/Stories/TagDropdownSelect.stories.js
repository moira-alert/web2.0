// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { range } from "lodash";
import TagDropdownSelect from "../Components/TagDropdownSelect/TagDropdownSelect";

type Props = {
    allowCreateNewTags?: boolean,
    availableTags: Array<string>,
};

type State = {
    tags: Array<string>,
};

class TagDropdownSelectContainer extends React.Component<Props, State> {
    props: Props;
    state: State = {
        tags: [],
    };

    render(): React.Element<any> {
        const { availableTags, allowCreateNewTags = false } = this.props;
        const { tags } = this.state;
        return (
            <TagDropdownSelect
                width={500}
                allowCreateNewTags={allowCreateNewTags}
                value={tags}
                onChange={x => this.setState({ tags: x })}
                availableTags={availableTags}
            />
        );
    }
}

storiesOf("TagDropdownSelect", module)
    .add("Default", () => (
        <TagDropdownSelect
            width={500}
            value={[]}
            onChange={action("onChange")}
            availableTags={["tag1", "tag2"]}
        />
    ))
    .add("Statefull", () => <TagDropdownSelectContainer availableTags={["tag1", "tag2"]} />)
    .add("AllowCreateNewTags", () => <TagDropdownSelectContainer allowCreateNewTags availableTags={["tag1", "tag2"]} />)
    .add("StatefullManyTags", () => (
        <TagDropdownSelectContainer
            availableTags={[
                "tag1",
                "tag2",
                ...range(0, 10).map(x => `'a-tag${x}'`),
                ...range(0, 10).map(x => `'b-tag${x}'`),
                ...range(0, 10).map(x => `'c-tag${x}'`),
                ...range(0, 10).map(x => `'d-tag${x}'`),
                ...range(0, 10).map(x => `'e-tag${x}'`),
                ...range(0, 10).map(x => `'z-tag${x}'`),
            ]}
        />
    ))
    .add("StatefullAnomalyManyTags", () => (
        <TagDropdownSelectContainer
            availableTags={[
                "tag1",
                "tag2",
                ...range(0, 50).map(x => `'a-tag${x}'`),
                ...range(0, 50).map(x => `'b-tag${x}'`),
                ...range(0, 50).map(x => `'c-tag${x}'`),
                ...range(0, 50).map(x => `'d-tag${x}'`),
                ...range(0, 50).map(x => `'e-tag${x}'`),
                ...range(0, 50).map(x => `'z-tag${x}'`),
            ]}
        />
    ))
    .add("ManySelectedTags", () => (
        <TagDropdownSelect
            width={500}
            value={[...range(0, 30).map(x => `'a-tag${x}'`)]}
            onChange={action("onChange")}
            availableTags={[...range(0, 50).map(x => `'a-tag${x}'`)]}
        />
    ));
