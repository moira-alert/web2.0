import * as React from "react";
import ReactDOM from "react-dom";
import Foco from "react-foco";
import cn from "./Selector.less";

const Portal = ({ children }: { children: React.ReactNode }) => {
    const container = document.body;

    if (!container) {
        throw new Error("Container for portal is empty");
    }
    return ReactDOM.createPortal(children, container);
};

// ToDo изменять размеры при ресайзе
const Dropdown = ({
    anchor,
    children,
}: {
    anchor?: HTMLLabelElement | null;
    children: React.ReactNode;
}) => {
    const SELECTOR_OUTLINE_SIZE = 1;

    if (!anchor) {
        throw new Error("Anchor in Dropdown component is empty");
    }

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

type Props = {
    search: string;
    tokens: string[];
    renderToken: (token: string) => React.ReactNode;
    children: React.ReactNode;
    onEnterKeyDown: () => void;
    onBackspaceKeyDown: () => void;
    onInputChange: (value: string) => void;
};

type State = {
    focused: boolean;
};

// ToDo прокинуть плейсхолдер
export default class Selector extends React.Component<Props, State> {
    public state: State = {
        focused: false,
    };

    private dropdownAnchorRef = React.createRef<HTMLLabelElement>();
    private searchInputRef = React.createRef<HTMLInputElement>();

    render(): React.ReactNode {
        const { focused } = this.state;
        const { search, tokens, renderToken, children } = this.props;

        return (
            <Foco className={cn("wrapper")} onClickOutside={this.closeDropdown}>
                <label
                    className={cn({ selector: true, focused })}
                    htmlFor="selector"
                    ref={this.dropdownAnchorRef}
                >
                    {tokens.map((token) => (
                        <span key={token} className={cn("token-container")}>
                            {renderToken(token)}
                        </span>
                    ))}
                    <input
                        className={cn("input")}
                        id="selector"
                        type="text"
                        value={search}
                        autoComplete="off"
                        ref={this.searchInputRef}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleInputKeyDown}
                        onFocus={this.openDropdown}
                    />
                </label>
                {focused && <Dropdown anchor={this.dropdownAnchorRef.current}>{children}</Dropdown>}
            </Foco>
        );
    }

    handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.onInputChange(evt.currentTarget.value);
    };

    handleInputKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>): void => {
        const { tokens } = this.props;
        if (evt.key === "Enter") {
            this.props.onEnterKeyDown();
            this.closeDropdown();
        }

        if (
            evt.key === "Backspace" &&
            evt.currentTarget.selectionStart === 0 &&
            tokens.length !== 0
        ) {
            this.props.onBackspaceKeyDown();
        }
    };

    openDropdown = (): void => {
        const { focused } = this.state;

        if (!focused) {
            this.setState({ focused: true });
        }
    };

    closeDropdown = (): void => {
        const { focused } = this.state;

        if (focused) {
            this.searchInputRef.current?.blur();
            this.setState({ focused: false });
        }
    };
}
