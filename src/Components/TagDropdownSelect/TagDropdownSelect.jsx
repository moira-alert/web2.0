// @flow
import * as React from "react";
import union from "lodash/union";
import difference from "lodash/difference";
import RenderLayer from "retail-ui/components/RenderLayer";
import LayoutEvents from "retail-ui/lib/LayoutEvents";
import DropdownContainer from "retail-ui/components/DropdownContainer/DropdownContainer";
import ScrollContainer from "retail-ui/components/ScrollContainer";
import Tag from "../Tag/Tag";
import NewTagBadge from "../NewTagBadge/NewTagBadge";
import cn from "./TagDropdownSelect.less";

type Props = {
    value: Array<string>,
    onChange: (Array<string>) => void,
    availableTags: Array<string>,
    error?: boolean,
    width: number,
    allowCreateNewTags?: boolean,
};

type State = {
    inputValue: string,
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
            focusedIndex: 0,
            inputValue: "",
            isFocused: false,
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
        const { width, value, availableTags, allowCreateNewTags } = this.props;
        const { inputValue, focusedIndex, isFocused: opened } = this.state;
        const filtredTags = this.filterTags(difference(availableTags, value));

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
                                <ScrollContainer maxHeight={300}>
                                    <div className={cn("tags-menu")} ref={this.tagsRef}>
                                        {filtredTags.length > 0 || allowCreateNewTags ? (
                                            <div className={cn("tag-list")}>
                                                {filtredTags.map((tag, i) => (
                                                    <Tag
                                                        key={tag}
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
                                                            focus={
                                                                focusedIndex ===
                                                                filtredTags.length + 1
                                                            }
                                                            onClick={() =>
                                                                this.selectTag(inputValue.trim())
                                                            }
                                                        />
                                                    )}
                                            </div>
                                        ) : (
                                            <div className={cn("no-tags")}>
                                                No matched tags found.
                                            </div>
                                        )}
                                    </div>
                                </ScrollContainer>
                            </DropdownContainer>
                        )}
                    </div>
                </RenderLayer>
                <span tabIndex="-1" ref={this.focusAnchorRef} />
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
                        const newIndex =
                            focusedIndex < filtredTags.length + 1 ? focusedIndex + 1 : 0;
                        this.setState({ focusedIndex: newIndex });
                    } else {
                        const newIndex = focusedIndex < filtredTags.length ? focusedIndex + 1 : 0;
                        this.setState({ focusedIndex: newIndex });
                    }
                    break;
                }
                case "Enter":
                    if (focusedIndex !== 0) {
                        if (inputValue.trim() === "") {
                            break;
                        } else if (
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
                        if (inputValue.trim() === "") {
                            break;
                        } else if (allowCreateNewTags && !this.tagExists(inputValue)) {
                            this.selectTag(inputValue);
                        } else if (filtredTags.length > 0) {
                            this.selectTag(filtredTags[filtredTags.length - 1]);
                        } else {
                            break;
                        }
                    }
                    this.setState({ inputValue: "" });
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

    removeTag = (tag: string) => {
        const { onChange, value } = this.props;
        onChange(difference(value, [tag]));
    };

    tagExists(name: string): boolean {
        const { availableTags } = this.props;
        return availableTags.includes(name);
    }

    selectTag(tag: string) {
        const { value, onChange } = this.props;
        onChange(union(value, [tag]));
        this.setState({ inputValue: "", focusedIndex: 0 });
        if (this.focusAnchorRef.current != null) {
            this.focusAnchorRef.current.focus();
        }
    }

    filterTags(tags: Array<string>): Array<string> {
        const { inputValue } = this.state;
        if (inputValue.trim() === "") {
            return tags;
        }
        return tags.filter(x => x.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1);
    }

    renderInput(): React.Node {
        const { error, value } = this.props;
        const { isFocused, inputValue } = this.state;
        return (
            <div className={cn("input-area", { focused: isFocused, error })}>
                {value.length !== 0 &&
                    value.map(tag => (
                        <span className={cn("tag-wrap")} key={tag}>
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
}
