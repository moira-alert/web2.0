// @flow
import * as React from "react";
import { concat } from "lodash";
import TagGroup from "../TagGroup/TagGroup";
import Tag from "../Tag/Tag";
import NewTagBadge from "../NewTagBadge/NewTagBadge";
import cn from "./TagSelector.less";

type Props = {|
    error?: boolean,
    subscribed: Array<string>,
    remained: Array<string>,
    selected: Array<string>,
    onSelect: (tag: string) => void,
    onRemove: (tag: string) => void,
    onMouseEnter?: (e: Event) => void,
    onMouseLeave?: (e: Event) => void,
    allowCreateNewTags?: boolean,
|};

type State = {
    value: string,
    focusedIndex: number,
    isFocused: boolean,
};

export default class TagSelector extends React.Component<Props, State> {
    props: Props;
    state: State = {
        value: "",
        focusedIndex: 0,
        isFocused: false,
    };

    filterTags(tags: Array<string>): Array<string> {
        const { value } = this.state;
        return tags.filter(x => x.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    handleAddNewTag = () => {
        const { onSelect } = this.props;
        const { value } = this.state;
        onSelect(value);
        this.setState({ value: "", focusedIndex: 0 });
    };

    selectTag(tag: string) {
        this.props.onSelect(tag);
        this.setState({ value: "", focusedIndex: 0 });
    }

    removeTag(tag: string) {
        this.props.onRemove(tag);
    }

    tagExists(name: string): boolean {
        return this.props.remained.includes(name);
    }

    handleKeyDown(key: string, caretPosition: number) {
        const { value, focusedIndex, isFocused } = this.state;
        const { allowCreateNewTags, selected, subscribed, remained } = this.props;
        const filtredTags = this.filterTags(concat(subscribed, remained));
        if (isFocused) {
            switch (key) {
                case "Delete":
                    break;
                case "Backspace":
                    if (caretPosition === 0 && selected.length !== 0) {
                        this.removeTag(selected[selected.length - 1]);
                    }
                    break;
                case "ArrowUp":
                    if (value.length !== 0) {
                        if (allowCreateNewTags) {
                            const newIndex = focusedIndex > 0 ? focusedIndex - 1 : filtredTags.length;
                            this.setState({ focusedIndex: newIndex });
                        } else {
                            const newIndex = focusedIndex > 0 ? focusedIndex - 1 : filtredTags.length;
                            this.setState({ focusedIndex: newIndex });
                        }
                    }
                    break;
                case "ArrowDown":
                    if (value.length !== 0) {
                        if (allowCreateNewTags && !this.tagExists(value)) {
                            const newIndex = focusedIndex < filtredTags.length + 1 ? focusedIndex + 1 : 0;
                            this.setState({ focusedIndex: newIndex });
                        } else {
                            const newIndex = focusedIndex < filtredTags.length ? focusedIndex + 1 : 0;
                            this.setState({ focusedIndex: newIndex });
                        }
                    }
                    break;
                case "Enter":
                    if (focusedIndex !== 0 && value.length !== 0) {
                        if (allowCreateNewTags && !this.tagExists(value) && focusedIndex === filtredTags.length + 1) {
                            this.selectTag(value);
                        } else {
                            this.selectTag(filtredTags[focusedIndex - 1]);
                        }
                    }
                    if (focusedIndex === 0 && value.length !== 0) {
                        if (allowCreateNewTags && !this.tagExists(value)) {
                            this.selectTag(value);
                        } else {
                            this.selectTag(filtredTags[filtredTags.length - 1]);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }

    render(): React.Node {
        const { error, selected, subscribed, remained, onMouseEnter, onMouseLeave, allowCreateNewTags } = this.props;
        const { value, focusedIndex, isFocused } = this.state;
        const filtredTags = this.filterTags(concat(subscribed, remained));
        return (
            <div>
                <div
                    className={cn("input-area", { focused: isFocused, error })}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}>
                    {selected.length !== 0 &&
                        selected.map((tag, i) => (
                            <span className={cn("tag-wrap")} key={i}>
                                <Tag title={tag} onRemove={() => this.removeTag(tag)} />
                            </span>
                        ))}
                    <input
                        className={cn("input")}
                        value={value}
                        onKeyDown={(event: KeyboardEvent) =>
                            event.target instanceof HTMLInputElement
                                ? this.handleKeyDown(event.key, event.target.selectionStart)
                                : null}
                        onChange={(event: Event) =>
                            event.target instanceof HTMLInputElement
                                ? this.setState({ value: event.target.value, focusedIndex: 0 })
                                : null}
                        onFocus={() => this.setState({ isFocused: true })}
                        onBlur={() => this.setState({ isFocused: false })}
                    />
                </div>
                {subscribed.length !== 0 &&
                    value.length === 0 && (
                        <div className={cn("group")}>
                            <b className={cn("title")}>Subscriptions</b>
                            <TagGroup tags={subscribed} onClick={tag => this.selectTag(tag)} />
                        </div>
                    )}
                {remained.length !== 0 &&
                    value.length === 0 && (
                        <div className={cn("group")}>
                            <b className={cn("title")}>All tags</b>
                            <TagGroup tags={remained} onClick={tag => this.selectTag(tag)} />
                        </div>
                    )}
                {value.length !== 0 && (
                    <div className={cn("group")}>
                        <b className={cn("title")}>Search results</b>
                        <div className={cn("tag-list")}>
                            {filtredTags.map((tag, i) => (
                                <Tag
                                    key={i}
                                    focus={i === focusedIndex - 1}
                                    title={tag}
                                    onClick={() => this.selectTag(tag)}
                                />
                            ))}
                            {allowCreateNewTags &&
                                !this.tagExists(value) &&
                                value.trim() !== "" && (
                                    <NewTagBadge
                                        title={value.trim()}
                                        focus={focusedIndex === filtredTags.length + 1}
                                        onClick={this.handleAddNewTag}
                                    />
                                )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
