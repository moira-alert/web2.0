import * as React from "react";
import union from "lodash/union";
import difference from "lodash/difference";
import { ScrollContainer } from "@skbkontur/react-ui/components/ScrollContainer";
import { Popup } from "@skbkontur/react-ui/internal/Popup";
import { RenderLayer } from "@skbkontur/react-ui/internal/RenderLayer";
import * as LayoutEvents from "@skbkontur/react-ui/lib/LayoutEvents";
import Tag from "../Tag/Tag";
import NewTagBadge from "../NewTagBadge/NewTagBadge";
import { ThemeContext } from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import { withThemeVars } from "../../Themes/withThemeVars";
import classNames from "classnames/bind";

import styles from "./TagDropdownSelect.module.less";

const cn = classNames.bind(styles);

type Props = {
    value: Array<string>;
    onChange: (tagList: Array<string>) => void;
    availableTags: Array<string>;
    error?: boolean;
    onBlur?: React.FocusEventHandler<HTMLDivElement>;
    isDisabled?: boolean;
    width?: string | number;
    allowCreateNewTags?: boolean;
    placeholder?: string;
    "data-tid"?: string;
};

type State = {
    inputValue: string;
    isFocused: boolean;
    focusedIndex: number;
};

export default class TagDropdownSelect extends React.Component<Props, State> {
    public state: State = {
        focusedIndex: 0,
        inputValue: "",
        isFocused: false,
    };

    private containerRef = React.createRef<HTMLSpanElement>();
    private tagsRef = React.createRef<HTMLDivElement>();
    private focusAnchorRef = React.createRef<HTMLSpanElement>();

    declare context: Theme;

    componentDidUpdate(): void {
        this.updateDropdownContainerMaxWidth();
        LayoutEvents.emit();
    }

    render(): React.ReactElement {
        const { width, value, availableTags, allowCreateNewTags, onBlur } = this.props;
        const { inputValue, focusedIndex, isFocused: opened } = this.state;
        const filteredTags = this.filterTags(difference(availableTags, value));
        const theme = this.context;

        return (
            <span className={cn("root")} style={{ width }} ref={this.containerRef}>
                <RenderLayer
                    onClickOutside={this.handleClickOutside}
                    onFocusOutside={this.handleFocusOutside}
                    active={opened}
                >
                    <div className={cn("wrapper")}>
                        {this.renderInput()}
                        {opened && (
                            <Popup
                                margin={2}
                                hasShadow
                                anchorElement={this.containerRef.current}
                                opened={true}
                                pos={"bottom left"}
                                positions={["bottom left"]}
                                style={{
                                    width: this.containerRef.current?.offsetWidth,
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: theme.inputBg,
                                        borderColor: theme.inputBorderColor,
                                    }}
                                    className={cn("tags-menu")}
                                    ref={this.tagsRef}
                                    onBlur={onBlur}
                                >
                                    <ScrollContainer maxHeight={300}>
                                        {filteredTags.length > 0 || allowCreateNewTags ? (
                                            <div className={cn("tag-list")}>
                                                {filteredTags.map((tag, i) => (
                                                    <Tag
                                                        key={tag}
                                                        focus={i === focusedIndex - 1}
                                                        title={tag}
                                                        data-tid={`Tag ${tag}`}
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
                                                                filteredTags.length + 1
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
                                    </ScrollContainer>
                                </div>
                            </Popup>
                        )}
                    </div>
                </RenderLayer>
                <span tabIndex={-1} ref={this.focusAnchorRef} />
            </span>
        );
    }

    handleClickOutside = (): void => {
        this.setState({ isFocused: false });
    };

    handleFocusOutside = (): void => {
        this.setState({ isFocused: false });
    };

    handleRemoveTag = (tag: string): void => {
        this.removeTag(tag);
    };

    handleKeyDown(key: string, caretPosition: number): void {
        const { focusedIndex, isFocused, inputValue } = this.state;
        const { allowCreateNewTags, value, availableTags } = this.props;
        const filteredTags = this.filterTags(difference(availableTags, value));

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
                        const newIndex = focusedIndex > 0 ? focusedIndex - 1 : filteredTags.length;
                        this.setState({ focusedIndex: newIndex });
                    } else {
                        const newIndex = focusedIndex > 0 ? focusedIndex - 1 : filteredTags.length;
                        this.setState({ focusedIndex: newIndex });
                    }
                    break;
                }
                case "ArrowDown": {
                    if (allowCreateNewTags && !this.tagExists(inputValue)) {
                        const newIndex =
                            focusedIndex < filteredTags.length + 1 ? focusedIndex + 1 : 0;
                        this.setState({ focusedIndex: newIndex });
                    } else {
                        const newIndex = focusedIndex < filteredTags.length ? focusedIndex + 1 : 0;
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
                            focusedIndex === filteredTags.length + 1
                        ) {
                            this.selectTag(inputValue);
                        } else {
                            this.selectTag(filteredTags[focusedIndex - 1]);
                        }
                    }

                    if (focusedIndex === 0) {
                        if (inputValue.trim() === "") {
                            break;
                        } else if (allowCreateNewTags && !this.tagExists(inputValue)) {
                            this.selectTag(inputValue);
                        } else if (filteredTags.length > 0) {
                            this.selectTag(filteredTags[filteredTags.length - 1]);
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

    public static contextType = ThemeContext;

    updateDropdownContainerMaxWidth(): void {
        const node = this.tagsRef?.current;

        if (node !== null) {
            node.style.maxWidth = `${node.getBoundingClientRect().width + 40}px`;
        }
    }

    removeTag = (tag: string): void => {
        const { onChange, value } = this.props;
        onChange(difference(value, [tag]));
    };

    tagExists(name: string): boolean {
        const { availableTags } = this.props;
        return availableTags.includes(name);
    }

    selectTag(tag: string): void {
        const { value, onChange } = this.props;
        onChange(union(value, [tag]));
        this.setState({ inputValue: "", focusedIndex: 0 });
        this.focusAnchorRef.current?.focus();
    }

    filterTags(tags: Array<string>): Array<string> {
        const { inputValue } = this.state;
        if (inputValue.trim() === "") {
            return tags;
        }
        return tags.filter((x) => x.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1);
    }

    renderInput(): React.ReactNode {
        const { error, value, isDisabled, placeholder, "data-tid": dataTid } = this.props;
        const { isFocused, inputValue } = this.state;
        const theme = this.context;

        return (
            <div
                style={withThemeVars(theme, [
                    "inputBorderColor",
                    "inputBorderColorHover",
                    "inputBorderColorFocus",
                    "inputBorderColorError",
                    "inputBg",
                    "inputDisabledBg",
                    "inputDisabledBorderColor",
                    "inputBorderWidth",
                    "inputBorderRadiusMedium",
                    "inputOutlineWidth",
                ])}
                className={
                    isDisabled
                        ? cn("input-area-disabled")
                        : cn("input-area", {
                              focused: isFocused,
                              error,
                          })
                }
            >
                <ScrollContainer maxHeight={300}>
                    {value.length !== 0 &&
                        value.map((tag) => (
                            <div className={cn("tag-wrap")} key={tag}>
                                <Tag title={tag} onRemove={() => this.handleRemoveTag(tag)} />
                            </div>
                        ))}
                    <input
                        className={cn("input")}
                        value={inputValue}
                        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
                            event.target instanceof HTMLInputElement &&
                            event.target.selectionStart !== null
                                ? this.handleKeyDown(event.key, event.target.selectionStart)
                                : null
                        }
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            event.target instanceof HTMLInputElement
                                ? this.setState({
                                      inputValue: event.target.value,
                                      focusedIndex: 0,
                                  })
                                : null
                        }
                        onFocus={() => this.setState({ isFocused: true })}
                        disabled={isDisabled}
                        placeholder={value.length === 0 ? placeholder : undefined}
                        data-tid={dataTid}
                    />
                </ScrollContainer>
            </div>
        );
    }
}
