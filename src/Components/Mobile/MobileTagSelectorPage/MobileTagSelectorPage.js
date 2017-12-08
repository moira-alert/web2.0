// @flow
import * as React from "react";
import { sortBy, union, difference } from "lodash";
import Toggle from "retail-ui/components/Toggle";

import MobileHeader from "../MobileHeader/MobileHeader";

import cn from "./MobileTagSelectorPage.less";

type Props = {|
    selectedTags: string[],
    availableTags: string[],
    onlyProblems: boolean,

    onChange: (selectedTags: string[], onlyProblems: boolean) => void,
    onClose: () => void,
|};

type State = {
    searchString: string,
    sortedTags: string[],
    nextSelectedTags: string[],
    nextOnlyProblems: boolean,
};

export default class MobileTagSelectorPage extends React.Component<Props, State> {
    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            searchString: "",
            sortedTags: sortBy(difference(props.availableTags, props.selectedTags), x => x),
            nextSelectedTags: props.selectedTags,
            nextOnlyProblems: props.onlyProblems,
        };
    }

    matches(target: string, str: string): boolean {
        return str
            .toLowerCase()
            .split(" ")
            .some(x => target.toLowerCase().includes(x));
    }

    renderTag = (tag: string): React.Node => {
        const { nextSelectedTags } = this.state;
        const tagSelected = nextSelectedTags.includes(tag);
        return (
            <div
                className={cn("tag")}
                onClick={() =>
                    this.setState({
                        nextSelectedTags: !tagSelected
                            ? union(nextSelectedTags, [tag])
                            : difference(nextSelectedTags, [tag]),
                    })
                }>
                <div className={cn("checkbox-area")}>
                    <span className={cn("checkbox", { checked: tagSelected })} />
                </div>
                <div className={cn("caption")}>{tag}</div>
            </div>
        );
    };

    handleApply = () => {
        const { onChange } = this.props;
        onChange(this.state.nextSelectedTags, this.state.nextOnlyProblems);
    };

    renderOnlyProblemsToggle(): React.Node {
        const { nextOnlyProblems } = this.state;

        return (
            <div className={cn("toggle-item")} onClick={() => this.setState({ nextOnlyProblems: !nextOnlyProblems })}>
                <div className={cn("caption")}>Show only problems</div>
                <div className={cn("toggle-area")}>
                    <Toggle checked={nextOnlyProblems} />
                </div>
            </div>
        );
    }

    render(): React.Node {
        const { selectedTags, availableTags, onClose } = this.props;
        const { searchString, sortedTags, nextSelectedTags } = this.state;
        const hasChanges =
            difference(selectedTags, nextSelectedTags).length > 0 ||
            difference(nextSelectedTags, selectedTags).length > 0 ||
            Boolean(this.state.nextOnlyProblems) !== Boolean(this.props.onlyProblems);

        return (
            <div className={cn("root")}>
                <MobileHeader>
                    <MobileHeader.HeaderBlock>
                        <MobileHeader.LeftButton icon="ArrowChevronLeft" onClick={onClose} />
                        <MobileHeader.HeaderInput
                            placeholder="Search tags..."
                            value={searchString}
                            onChange={(e, value) => this.setState({ searchString: value })}
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
                    <div>{availableTags.filter(x => this.matches(x, searchString)).map(this.renderTag)}</div>
                )}
                {hasChanges && <BottomFixedButton onClick={this.handleApply}>Apply</BottomFixedButton>}
            </div>
        );
    }
}

type BottomFixedButtonProps = {|
    children: React.Node,
    onClick: () => void,
|};

function BottomFixedButton({ children, onClick }: BottomFixedButtonProps): React.Node {
    return (
        <div className={cn("bottom-fixed-button-container")}>
            <button className={cn("bottom-fixed-button")} onClick={onClick}>
                {children}
            </button>
        </div>
    );
}
