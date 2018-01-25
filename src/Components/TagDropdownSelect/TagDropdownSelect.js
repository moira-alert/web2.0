// @flow
import * as React from "react";
import { findDOMNode } from "react-dom";
import { union, difference } from "lodash";
import RenderLayer from "retail-ui/components/RenderLayer";
import LayoutEvents from "retail-ui/lib/LayoutEvents";
import DropdownContainer from "retail-ui/components/DropdownContainer/DropdownContainer";
import ScrollContainer from "retail-ui/components/ScrollContainer/ScrollContainer";
import Tag from "../Tag/Tag";
import NewTagBadge from "../NewTagBadge/NewTagBadge";
import cn from "./TagDropdownSelect.less";

type Props = {
    value: Array<string>,
    onChange: (Array<string>) => void,
    availableTags: Array<string>,
    error?: boolean,
    width?: string | number,
    allowCreateNewTags?: boolean,
    onMouseEnter?: (e: Event) => void,
    onMouseLeave?: (e: Event) => void,
};

type State = {
    opened: boolean,
    inputValue: string,
    isFocused: boolean,
    focusedIndex: number,
};

export default class TagDropdownSelect extends React.Component<Props, State> {
    props: Props;
    state: State = {
        opened: false,
        focusedIndex: 0,
        inputValue: "",
        isFocused: false,
    };

    tagExists(name: string): boolean {
        return this.props.availableTags.includes(name);
    }

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
        const { onChange, value } = this.props;
        onChange(difference(value, [tag]));
    };

    handleKeyDown(key: string, caretPosition: number) {
        const { focusedIndex, isFocused, inputValue } = this.state;
        const { allowCreateNewTags, value, availableTags } = this.props;
        const filtredTags = this.filterTags(difference(availableTags, value));

        if (isFocused) {
            switch (key) {
                case "Delete":
                    break;
                case "Backspace":
                    if (caretPosition === 0 && value.length !== 0) {
                        this.removeTag(value[value.length - 1]);
                    }
                    break;
                case "ArrowUp": {
                    if (allowCreateNewTags) {
                        const newIndex = focusedIndex > 0 ? focusedIndex - 1 : filtredTags.length;
                        this.setState({ focusedIndex: newIndex });
                    } else {
                        const newIndex = focusedIndex > 0 ? focusedIndex - 1 : filtredTags.length;
                        this.setState({ focusedIndex: newIndex });
                    }
                    break;
                }
                case "ArrowDown": {
                    if (allowCreateNewTags && !this.tagExists(inputValue)) {
                        const newIndex = focusedIndex < filtredTags.length + 1 ? focusedIndex + 1 : 0;
                        this.setState({ focusedIndex: newIndex });
                    } else {
                        const newIndex = focusedIndex < filtredTags.length ? focusedIndex + 1 : 0;
                        this.setState({ focusedIndex: newIndex });
                    }
                    break;
                }
                case "Enter":
                    if (focusedIndex !== 0) {
                        if (
                            allowCreateNewTags &&
                            !this.tagExists(inputValue) &&
                            focusedIndex === filtredTags.length + 1
                        ) {
                            this.selectTag(inputValue);
                        } else {
                            this.selectTag(filtredTags[focusedIndex - 1]);
                        }
                    }
                    if (focusedIndex === 0) {
                        if (allowCreateNewTags && !this.tagExists(inputValue)) {
                            this.selectTag(inputValue);
                        } else {
                            this.selectTag(filtredTags[filtredTags.length - 1]);
                        }
                    }
                    this.setState({ inputValue: "" });
                    break;
                default:
                    break;
            }
        }
    }

    renderInput(): React.Node {
        const { onMouseEnter, onMouseLeave, error, value } = this.props;
        const { isFocused, inputValue } = this.state;
        return (
            <div
                className={cn("input-area", { focused: isFocused, error })}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}>
                {value.length !== 0 &&
                    value.map((tag, i) => (
                        <span className={cn("tag-wrap")} key={i}>
                            <Tag title={tag} onRemove={() => this.handleRemoveTag(tag)} />
                        </span>
                    ))}
                <input
                    className={cn("input")}
                    value={inputValue}
                    onKeyDown={(event: KeyboardEvent) =>
                        event.target instanceof HTMLInputElement
                            ? this.handleKeyDown(event.key, event.target.selectionStart)
                            : null
                    }
                    onChange={(event: Event) =>
                        event.target instanceof HTMLInputElement
                            ? this.setState({ inputValue: event.target.value, focusedIndex: 0 })
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
        const { value, onChange } = this.props;
        onChange(union(value, [tag]));
        this.setState({ inputValue: "", focusedIndex: 0 });
        if (this.refs.focusAnchor != null) {
            this.refs.focusAnchor.focus();
        }
    }

    filterTags(tags: Array<string>): Array<string> {
        const { inputValue } = this.state;
        if (inputValue.trim() === "") {
            return tags;
        }
        return tags.filter(x => x.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1);
    }

    render(): React.Element<any> {
        const { width, value, availableTags, allowCreateNewTags } = this.props;
        const { inputValue, focusedIndex, isFocused: opened } = this.state;
        const filtredTags = this.filterTags(difference(availableTags, value));

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
                                <ScrollContainer maxHeight={300}>
                                    <div className={cn("tags-menu")} ref="menu">
                                        {filtredTags.length > 0 || allowCreateNewTags ? (
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
                                                    !this.tagExists(inputValue) &&
                                                    inputValue.trim() !== "" && (
                                                        <NewTagBadge
                                                            title={inputValue.trim()}
                                                            focus={focusedIndex === filtredTags.length + 1}
                                                            onClick={() => this.selectTag(inputValue.trim())}
                                                        />
                                                    )}
                                            </div>
                                        ) : (
                                            <div className={cn("no-tags")}>No matched tags found.</div>
                                        )}
                                    </div>
                                </ScrollContainer>
                            </DropdownContainer>
                        )}
                    </label>
                </RenderLayer>
                <span tabIndex="-1" ref="focusAnchor" />
            </span>
        );
    }
}
