// @flow
import * as React from "react";
import { findDOMNode } from "react-dom";
import { concat } from "lodash";
import TagGroup from "../TagGroup/TagGroup";
import RenderLayer from "retail-ui/components/RenderLayer";
import LayoutEvents from "retail-ui/lib/LayoutEvents";
import DropdownContainer from "retail-ui/components/DropdownContainer/DropdownContainer";
import ScrollContainer from "retail-ui/components/ScrollContainer/ScrollContainer";
import Tag from "../Tag/Tag";
import cn from "./TagDropdownSelect2.less";

type Props = {
    subscribed: Array<string>,
    remained: Array<string>,
    selected: Array<string>,
    onSelect: (tag: string) => void,
    onRemove: (tag: string) => void,
    width?: string | number,
};

type State = {
    opened: boolean,
    value: string,
    isFocused: boolean,
    focusedIndex: number,
};

export default class TagDropdownSelect extends React.Component<Props, State> {
    props: Props;
    state: State = {
        value: "",
        opened: false,
        isFocused: false,
        focusedIndex: 0,
    };

    handleClickOutside = () => {
        this.setState({ isFocused: false });
    };

    handleFocusOutside = () => {
        this.setState({ isFocused: false });
    };

    handleRemoveTag = (tag: string) => {
        this.removeTag(tag);
    };

    removeTag = (tag: string) => {
        const { onRemove } = this.props;
        onRemove(tag);
    };

    handleKeyDown(key: string, caretPosition: number) {
        const { focusedIndex, isFocused } = this.state;
        const { selected, subscribed, remained } = this.props;
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
                case "ArrowUp": {
                    const newIndex = focusedIndex > 0 ? focusedIndex - 1 : filtredTags.length;
                    this.setState({ focusedIndex: newIndex });
                    break;
                }
                case "ArrowDown": {
                    const newIndex = focusedIndex < filtredTags.length ? focusedIndex + 1 : 0;
                    this.setState({ focusedIndex: newIndex });
                    break;
                }
                case "Enter":
                    if (focusedIndex !== 0) {
                        this.selectTag(filtredTags[focusedIndex - 1]);
                    }
                    if (focusedIndex === 0) {
                        this.selectTag(filtredTags[filtredTags.length - 1]);
                    }
                    this.setState({ value: "" });
                    break;
                default:
                    break;
            }
        }
    }

    renderInput(): React.Node {
        const { selected } = this.props;
        const { isFocused, value } = this.state;
        return (
            <div className={cn("input-area", { focused: isFocused })}>
                {selected.length !== 0 &&
                    selected.map((tag, i) => (
                        <span className={cn("tag-wrap")} key={i}>
                            <Tag title={tag} onRemove={() => this.handleRemoveTag(tag)} />
                        </span>
                    ))}
                <input
                    className={cn("input")}
                    value={value}
                    onKeyDown={(event: KeyboardEvent) =>
                        event.target instanceof HTMLInputElement
                            ? this.handleKeyDown(event.key, event.target.selectionStart)
                            : null
                    }
                    onChange={(event: Event) =>
                        event.target instanceof HTMLInputElement
                            ? this.setState({ value: event.target.value, focusedIndex: 0 })
                            : null
                    }
                    onFocus={() => this.setState({ isFocused: true })}
                />
            </div>
        );
    }

    componentDidUpdate() {
        this.updateDropdownContainerMaxWidth();
        LayoutEvents.emit();
    }

    updateDropdownContainerMaxWidth() {
        const currentElement = findDOMNode(this);
        const menu = this.refs.menu;
        if (menu == null) {
            return;
        }
        if (currentElement instanceof HTMLElement) {
            menu.style.maxWidth = `${currentElement.getBoundingClientRect().width + 40}px`;
        }
    }

    selectTag(tag: string) {
        const { onSelect } = this.props;
        onSelect(tag);
        if (this.refs.focusAnchor != null) {
            this.refs.focusAnchor.focus();
        }
    }

    filterTags(tags: Array<string>): Array<string> {
        const { value } = this.state;
        if (value.trim() === "") {
            return tags;
        }
        return tags.filter(x => x.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    render(): React.Element<any> {
        const { subscribed, remained, width } = this.props;
        const { focusedIndex, isFocused: opened, value } = this.state;
        const filtredTags = this.filterTags(concat(subscribed, remained));

        return (
            <span className={cn("root")} style={{ width: width }}>
                <RenderLayer
                    onClickOutside={this.handleClickOutside}
                    onFocusOutside={this.handleFocusOutside}
                    active={opened}>
                    <label style={{ width: "100%", display: "inline-block", position: "relative" }}>
                        {this.renderInput()}
                        {opened && (
                            <DropdownContainer align={"left"} getParent={() => findDOMNode(this)} offsetY={1}>
                                <div className={cn("menu-container")}>
                                    <ScrollContainer maxHeight={300}>
                                        <div className={cn("tags-menu")} ref="menu">
                                            {subscribed.length !== 0 &&
                                                value.length === 0 && (
                                                    <div className={cn("group")}>
                                                        <b className={cn("title")}>Subscriptions</b>
                                                        <TagGroup
                                                            tags={subscribed}
                                                            onClick={tag => this.selectTag(tag)}
                                                        />
                                                    </div>
                                                )}
                                            {remained.length !== 0 &&
                                                value.length === 0 && (
                                                    <div className={cn("group")}>
                                                        <b className={cn("title")}>All tags</b>
                                                        <TagGroup
                                                            tags={remained}
                                                            onClick={tag => this.selectTag(tag)}
                                                        />
                                                    </div>
                                                )}
                                            {value.length !== 0 && (
                                                <div className={cn("group")}>
                                                    <b className={cn("title")}>Search results</b>
                                                    <div className={cn("tag-list")}>
                                                        {filtredTags.length > 0 ? (
                                                            filtredTags.map((tag, i) => (
                                                                <Tag
                                                                    key={i}
                                                                    focus={i === focusedIndex - 1}
                                                                    title={tag}
                                                                    onClick={() => this.selectTag(tag)}
                                                                />
                                                            ))
                                                        ) : (
                                                            <div className={cn("no-tags")}>No matched tags found.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}{" "}
                                        </div>
                                    </ScrollContainer>
                                </div>
                            </DropdownContainer>
                        )}
                    </label>
                </RenderLayer>
                <span tabIndex="-1" ref="focusAnchor">
                    {" "}
                </span>
            </span>
        );
    }
}
