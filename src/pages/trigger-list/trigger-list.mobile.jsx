// @flow
import * as React from "react";
import MobileTriggerListPage from "../../Components/Mobile/MobileTriggerListPage/MobileTriggerListPage";
import MobileTagSelectorPage from "../../Components/Mobile/MobileTagSelectorPage/MobileTagSelectorPage";

// ToDo типизация State и Props
class TriggerListMobile extends React.Component {
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
        onChange({
            tags: nextTags,
            onlyProblems: nextOnlyProblems,
        });
    };
}

export { TriggerListMobile as default };
