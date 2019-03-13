// @flow
import * as React from "react";
import ReactDOM from "react-dom";
import Foco from "react-foco";
import cn from "./Selector.less";

const Portal = ({ children }: { children: React.Node }) =>
    ReactDOM.createPortal(children, document.body);

// ToDo изменять размеры при ресайзе
const Dropdown = ({ anchor, children }: { anchor: ?HTMLLabelElement, children: React.Node }) => {
    const SELECTOR_OUTLINE_SIZE = 1;

    const {
        top: anchorTop,
        left: anchorLeft,
        height: anchorHeight,
        width,
    } = anchor.getBoundingClientRect();

    const top = anchorTop + anchorHeight + SELECTOR_OUTLINE_SIZE + window.pageYOffset;

    const left = anchorLeft + window.pageXOffset;

    return (
        <Portal>
            <div className={cn("dropdown")} style={{ top, left, width }}>
                {children}
            </div>
        </Portal>
    );
};

type Props = {|
    search: string,
    tokens: string[],
    renderToken: (value: string) => React.Node,
    children: React.Node,
    onEnterKeyDown: () => void,
    onInputChange: (value: string) => void,
|};

type State = {
    focused: boolean,
};

// ToDo прокинуть плейсхолдер
class Selector extends React.Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            focused: false,
        };

        this.dropdownAnchorRef = React.createRef();

        this.searchInputRef = React.createRef();
    }

    render() {
        const { focused } = this.state;
        const { search, tokens, renderToken, children } = this.props;

        return (
            <React.Fragment>
                <Foco className={cn("wrapper")} onClickOutside={this.closeDropdown}>
                    <label
                        className={cn({ selector: true, focused })}
                        htmlFor="selector"
                        ref={this.dropdownAnchorRef}
                    >
                        {tokens.map(token => (
                            <span key={token} className={cn("token-container")}>
                                {renderToken(token)}
                            </span>
                        ))}
                        <input
                            className={cn("input")}
                            id="selector"
                            type="text"
                            value={search}
                            ref={this.searchInputRef}
                            onChange={this.handleInputChange}
                            onKeyDown={this.handleInputKeyDown}
                            onFocus={this.openDropdown}
                        />
                    </label>
                    {focused && (
                        <Dropdown anchor={this.dropdownAnchorRef.current}>{children}</Dropdown>
                    )}
                </Foco>
            </React.Fragment>
        );
    }

    handleInputChange = evt => {
        const { onInputChange } = this.props;
        const { value } = evt.target;

        onInputChange(value);
    };

    handleInputKeyDown = evt => {
        if (evt.key !== "Enter") {
            return;
        }

        const { onEnterKeyDown } = this.props;

        onEnterKeyDown();

        this.closeDropdown();
    };

    openDropdown = () => {
        const { focused } = this.state;

        if (!focused) {
            this.setState({ focused: true });
        }
    };

    closeDropdown = () => {
        const { focused } = this.state;

        if (focused) {
            this.searchInputRef.current.blur();

            this.setState({ focused: false });
        }
    };
}

export { Selector as default };
