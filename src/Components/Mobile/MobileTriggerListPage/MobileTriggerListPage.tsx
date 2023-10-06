import * as React from "react";
import { Paging } from "@skbkontur/react-ui/components/Paging";
import { Spinner } from "@skbkontur/react-ui/components/Spinner";
import FilterIcon from "@skbkontur/react-icons/Filter";
import { Trigger } from "../../../Domain/Trigger";
import MobileTriggerListItem from "../MobileTriggerListItem/MobileTriggerListItem";
import MobileHeader from "../MobileHeader/MobileHeader";
import classNames from "classnames/bind";

import styles from "./MobileTriggerListPage.less";

const cn = classNames.bind(styles);

type MobileTriggerListPageProps = {
    loading?: boolean;
    triggers?: Array<Trigger> | null;
    selectedTags?: Array<string> | null;
    activePage: number;
    pageCount: number;
    onChange: (pageObject: { page: number }) => void;
    onOpenTagSelector: () => void;
};

export default class MobileTriggerListPage extends React.Component<MobileTriggerListPageProps> {
    render(): React.ReactNode {
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
                        triggers.map((trigger) => (
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
                            onPageChange={(page) => {
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
