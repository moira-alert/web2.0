import * as React from "react";
import sortBy from "lodash/sortBy";
import union from "lodash/union";
import difference from "lodash/difference";
import { Toggle } from "@skbkontur/react-ui/components/Toggle";
import ArrowChevronLeftIcon from "@skbkontur/react-icons/ArrowChevronLeft";
import MobileHeader from "../MobileHeader/MobileHeader";
import classNames from "classnames/bind";

import styles from "./MobileTagSelectorPage.module.less";

const cn = classNames.bind(styles);

type Props = {
    selectedTags: string[];
    availableTags: string[];
    onlyProblems: boolean;
    onChange: (selectedTags: string[], onlyProblems: boolean) => void;
    onClose: () => void;
};

type State = {
    searchString: string;
    sortedTags: string[];
    nextSelectedTags: string[];
    nextOnlyProblems: boolean;
};

export default class MobileTagSelectorPage extends React.Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            searchString: "",
            sortedTags: sortBy(difference(props.availableTags, props.selectedTags), (x) => x),
            nextSelectedTags: props.selectedTags,
            nextOnlyProblems: props.onlyProblems,
        };
    }

    static matches(target: string, str: string): boolean {
        return str
            .toLowerCase()
            .split(" ")
            .some((x) => target.toLowerCase().includes(x));
    }

    render(): React.ReactElement {
        const { selectedTags, availableTags, onClose, onlyProblems } = this.props;
        const { searchString, sortedTags, nextSelectedTags, nextOnlyProblems } = this.state;
        const hasChanges =
            difference(selectedTags, nextSelectedTags).length > 0 ||
            difference(nextSelectedTags, selectedTags).length > 0 ||
            Boolean(nextOnlyProblems) !== Boolean(onlyProblems);

        return (
            <div className={cn("root")}>
                <MobileHeader>
                    <MobileHeader.HeaderBlock>
                        <MobileHeader.LeftButton
                            icon={<ArrowChevronLeftIcon />}
                            onClick={onClose}
                        />
                        <MobileHeader.HeaderInput
                            placeholder="Search tags..."
                            value={searchString}
                            onChange={(_e, value) => this.setState({ searchString: value })}
                            onClear={() => this.setState({ searchString: "" })}
                        />
                    </MobileHeader.HeaderBlock>
                </MobileHeader>
                {searchString === "" && (
                    <div>
                        {this.renderOnlyProblemsToggle()}
                        {selectedTags.map(this.renderTag)}
                        {sortedTags.map(this.renderTag)}
                    </div>
                )}
                {searchString !== "" && (
                    <div>
                        {availableTags
                            .filter((x) => MobileTagSelectorPage.matches(x, searchString))
                            .map(this.renderTag)}
                    </div>
                )}
                {hasChanges && (
                    <BottomFixedButton onClick={this.handleApply}>Apply</BottomFixedButton>
                )}
            </div>
        );
    }

    handleApply = (): void => {
        const { nextSelectedTags, nextOnlyProblems } = this.state;
        const { onChange } = this.props;
        onChange(nextSelectedTags, nextOnlyProblems);
    };

    renderOnlyProblemsToggle(): React.ReactNode {
        const { nextOnlyProblems } = this.state;

        return (
            <label className={cn("toggle")}>
                <span className={cn("toggle-label")}>Show only problems</span>
                <span className={cn("toggle-control")}>
                    <Toggle
                        checked={nextOnlyProblems}
                        onChange={() => this.setState({ nextOnlyProblems: !nextOnlyProblems })}
                    />
                </span>
            </label>
        );
    }

    renderTag = (tag: string): React.ReactNode => {
        const { nextSelectedTags } = this.state;
        const tagSelected = nextSelectedTags.includes(tag);
        return (
            <div
                key={tag}
                className={cn("tag")}
                onClick={() =>
                    this.setState({
                        nextSelectedTags: !tagSelected
                            ? union(nextSelectedTags, [tag])
                            : difference(nextSelectedTags, [tag]),
                    })
                }
            >
                <div className={cn("checkbox-area")}>
                    <span className={cn("checkbox", { checked: tagSelected })} />
                </div>
                <div className={cn("caption")}>{tag}</div>
            </div>
        );
    };
}

type BottomFixedButtonProps = {
    children: React.ReactNode;
    onClick: () => void;
};

function BottomFixedButton({ children, onClick }: BottomFixedButtonProps): React.ReactElement {
    return (
        <div className={cn("bottom-fixed-button-container")}>
            <button type="button" className={cn("bottom-fixed-button")} onClick={onClick}>
                {children}
            </button>
        </div>
    );
}
