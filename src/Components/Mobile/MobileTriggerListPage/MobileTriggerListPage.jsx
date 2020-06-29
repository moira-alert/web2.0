// @flow
import * as React from "react";
import { Paging } from "@skbkontur/react-ui/components/Paging";
import { Spinner } from "@skbkontur/react-ui/components/Spinner";
import MenuIcon from "@skbkontur/react-icons/Menu";
import FilterIcon from "@skbkontur/react-icons/Filter";
import type { Trigger } from "../../../Domain/Trigger";
import MobileTriggerListItem from "../MobileTriggerListItem/MobileTriggerListItem";
import MobileHeader from "../MobileHeader/MobileHeader";
import cn from "./MobileTriggerListPage.less";

type MobileTriggerListPageProps = {
    loading?: boolean,
    triggers: ?Array<Trigger>,
    selectedTags: ?Array<string>,
    activePage: number,
    pageCount: number,
    onChange: ({ page: number }) => void,
    onOpenTagSelector: () => void,
};

export default class MobileTriggerListPage extends React.Component<MobileTriggerListPageProps> {
    props: MobileTriggerListPageProps;

    render(): React.Node {
        const {
            loading,
            triggers,
            onOpenTagSelector,
            activePage,
            pageCount,
            onChange,
        } = this.props;

        return (
            <div>
                <MobileHeader>
                    <MobileHeader.HeaderBlock>
                        <MobileHeader.LeftButton icon={<MenuIcon />} />
                        <MobileHeader.Title>Moira: {this.renderTitle()}</MobileHeader.Title>
                        <MobileHeader.RightButton
                            icon={<FilterIcon />}
                            onClick={onOpenTagSelector}
                        />
                    </MobileHeader.HeaderBlock>
                </MobileHeader>
                <div className={cn("content")}>
                    {triggers != null && triggers.length === 0 && (
                        <div style={{ padding: 30, color: "#666", textAlign: "center" }}>
                            No results :-(
                        </div>
                    )}
                    {triggers != null &&
                        triggers.map(trigger => (
                            <MobileTriggerListItem key={trigger.id} data={trigger} />
                        ))}
                    {triggers != null && loading && (
                        <div>
                            <Spinner type="mini" caption="Loading..." />
                        </div>
                    )}
                </div>
                {pageCount > 1 && (
                    <div style={{ padding: "25px 15px 50px" }}>
                        <Paging
                            caption="Next page"
                            activePage={activePage}
                            pagesCount={pageCount}
                            onPageChange={page => {
                                if (onChange) {
                                    onChange({ page });
                                }
                            }}
                            withoutNavigationHint
                        />
                    </div>
                )}
            </div>
        );
    }

    renderTitle(): string {
        const { triggers, loading, selectedTags } = this.props;
        if (triggers == null && loading) {
            return "Loading...";
        }
        if (selectedTags == null || selectedTags.length === 0) {
            return "All triggers";
        }
        if (selectedTags.length === 1) {
            return `#${selectedTags[0]}`;
        }
        return `${selectedTags.length} tags`;
    }
}
