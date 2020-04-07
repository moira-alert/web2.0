// @flow
import * as React from "react";
import concat from "lodash/concat";
import { RenderLayer } from "@skbkontur/react-ui/internal/RenderLayer";
import * as LayoutEvents from "@skbkontur/react-ui/lib/LayoutEvents";
import { ScrollContainer } from "@skbkontur/react-ui";
import { DropdownContainer } from "@skbkontur/react-ui/internal/DropdownContainer";
import TagGroup from "../TagGroup/TagGroup";
import Tag from "../Tag/Tag";
import cn from "./TagDropdownSelect2.less";

type Props = {
    subscribed: Array<string>,
    remained: Array<string>,
    selected: Array<string>,
    onSelect: (tag: string) => void,
    onRemove: (tag: string) => void,
    width: string | number,
};

type State = {
    value: string,
    isFocused: boolean,
    focusedIndex: number,
};

export default class TagDropdownSelect extends React.Component<Props, State> {
    state: State;

    containerRef: { current: null | HTMLSpanElement };

    tagsRef: ?{ current: null | HTMLDivElement };

    focusAnchorRef: { current: null | HTMLSpanElement };

    constructor(props: Props) {
        super(props);
        this.state = {
            value: "",
            isFocused: false,
            focusedIndex: 0,
        };
        this.containerRef = React.createRef<HTMLSpanElement>();
        this.tagsRef = React.createRef<HTMLDivElement>();
        this.focusAnchorRef = React.createRef<HTMLSpanElement>();
    }

    componentDidUpdate() {
        this.updateDropdownContainerMaxWidth();
        LayoutEvents.emit();
    }

    render(): React.Element<any> {
        const { subscribed, remained, width } = this.props;
        const { focusedIndex, isFocused: opened, value } = this.state;
        const filtredTags = this.filterTags(concat(subscribed, remained));
        return (
            <span className={cn("root")} style={{ width }} ref={this.containerRef}>
                <RenderLayer
                    onClickOutside={this.handleClickOutside}
                    onFocusOutside={this.handleFocusOutside}
                    active={opened}
                >
                    {/* eslint-disable-next-line */}
                    <div className={cn("wrapper")}>
                        {this.renderInput()}
                        {opened && (
                            <DropdownContainer
                                align="left"
                                getParent={() => this.containerRef.current}
                                offsetY={1}
                            >
                                <div className={cn("menu-container")}>
                                    <ScrollContainer maxHeight={300}>
                                        <div className={cn("tags-menu")} ref={this.tagsRef}>
                                            {subscribed.length !== 0 && value.length === 0 && (
                                                <div className={cn("group")}>
                                                    <b className={cn("title")}>Subscriptions</b>
                                                    <TagGroup
                                                        tags={subscribed}
                                                        onClick={tag => this.selectTag(tag)}
                                                    />
                                                </div>
                                            )}
                                            {remained.length !== 0 && value.length === 0 && (
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
                                                                    key={tag}
                                                                    focus={i === focusedIndex - 1}
                                                                    title={tag}
                                                                    onClick={() =>
                                                                        this.selectTag(tag)
                                                                    }
                                                                />
                                                            ))
                                                        ) : (
                                                            <div className={cn("no-tags")}>
                                                                No matched tags found.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}{" "}
                                        </div>
                                    </ScrollContainer>
                                </div>
                            </DropdownContainer>
                        )}
                    </div>
                </RenderLayer>
                <span tabIndex="-1" ref={this.focusAnchorRef}>
                    {" "}
                </span>
            </span>
        );
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

    updateDropdownContainerMaxWidth() {
        if (this.tagsRef) {
            const node = this.tagsRef.current;
            if (node !== null) {
                node.style.maxWidth = `${node.getBoundingClientRect().width + 40}px`;
            }
        }
    }

    renderInput(): React.Node {
        const { selected } = this.props;
        const { isFocused, value } = this.state;
        return (
            <div className={cn("input-area", { focused: isFocused })}>
                {selected.length !== 0 &&
                    selected.map(tag => (
                        <span className={cn("tag-wrap")} key={tag}>
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
                            ? this.setState({
                                  value: event.target.value.replace(/\s/gi, ""),
                                  focusedIndex: 0,
                              })
                            : null
                    }
                    onFocus={() => this.setState({ isFocused: true })}
                />
            </div>
        );
    }

    selectTag(tag: string) {
        const { onSelect } = this.props;
        this.setState({ value: "", focusedIndex: 0 });
        onSelect(tag);
        if (this.focusAnchorRef.current !== null) {
            this.focusAnchorRef.current.focus();
        }
    }

    filterTags(tags: Array<string>): Array<string> {
        const { value } = this.state;
        if (value.trim() === "") {
            return tags;
        }
        return tags.filter(x => x.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }

    removeTag = (tag: string) => {
        const { onRemove } = this.props;
        onRemove(tag);
    };
}
