import React, { ReactElement } from "react";
import MobileTriggerListPage from "../../Components/Mobile/MobileTriggerListPage/MobileTriggerListPage";
import MobileTagSelectorPage from "../../Components/Mobile/MobileTagSelectorPage/MobileTagSelectorPage";
import type { Trigger } from "../../Domain/Trigger";
import { TriggerListUpdate } from "./trigger-list";
import { History } from "history";

export type TriggerListMobileProps = {
    selectedTags: string[];
    allTags: string[];
    onlyProblems: boolean;
    triggers: Array<Trigger>;
    activePage: number;
    pageCount: number;
    history: History;
    onChange: (update: TriggerListUpdate) => void;
};

type State = {
    showTagSelector: boolean;
};

export default class TriggerListMobile extends React.Component<TriggerListMobileProps, State> {
    public state: State = {
        showTagSelector: false,
    };

    public render(): ReactElement {
        const {
            selectedTags,
            allTags,
            onlyProblems,
            triggers,
            activePage,
            pageCount,
            history,
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
                history={history}
                pageCount={pageCount}
                onChange={onChange}
            />
        );
    }

    handleChangeSelectedTags = (nextTags: string[], nextOnlyProblems: boolean): void => {
        this.setState({ showTagSelector: false });

        this.props.onChange({
            tags: nextTags,
            onlyProblems: nextOnlyProblems,
        });
    };
}
