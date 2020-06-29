// @flow
import * as React from "react";
import MobileTriggerListPage from "../../Components/Mobile/MobileTriggerListPage/MobileTriggerListPage";
import MobileTagSelectorPage from "../../Components/Mobile/MobileTagSelectorPage/MobileTagSelectorPage";
import type { Trigger } from "../../Domain/Trigger";

type Props = {
    selectedTags: string[],
    allTags: string[],
    onlyProblems: boolean,
    triggers: Array<Trigger>,
    activePage: number,
    pageCount: number,
    onChange?: ({ page: number }) => void,
};

type State = {
    showTagSelector: boolean,
};

class TriggerListMobile extends React.Component<Props, State> {
    state = {
        showTagSelector: false,
    };

    render() {
        const {
            selectedTags,
            allTags,
            onlyProblems,
            triggers,
            activePage,
            pageCount,
            onChange,
        } = this.props;
        const { showTagSelector } = this.state;

        if (showTagSelector) {
            return (
                <MobileTagSelectorPage
                    availableTags={allTags}
                    selectedTags={selectedTags}
                    onlyProblems={onlyProblems}
                    onClose={() => this.setState({ showTagSelector: false })}
                    onChange={this.handleChangeSelectedTags}
                />
            );
        }

        return (
            <MobileTriggerListPage
                selectedTags={selectedTags}
                triggers={triggers}
                loading={false}
                onOpenTagSelector={() => this.setState({ showTagSelector: true })}
                activePage={activePage}
                pageCount={pageCount}
                onChange={onChange}
            />
        );
    }

    handleChangeSelectedTags = (nextTags: string[], nextOnlyProblems: boolean) => {
        const { onChange } = this.props;
        this.setState({ showTagSelector: false });

        if (onChange) {
            onChange({
                tags: nextTags,
                onlyProblems: nextOnlyProblems,
            });
        }
    };
}

export { TriggerListMobile as default };
