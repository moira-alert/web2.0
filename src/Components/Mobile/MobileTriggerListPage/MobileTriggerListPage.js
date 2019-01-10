// @flow
import * as React from "react";
import Spinner from "retail-ui/components/Spinner";

import type { Trigger } from "../../../Domain/Trigger";

import MobileTriggerListItem from "../MobileTriggerListItem/MobileTriggerListItem";
import MobileEmptyContentLoading from "../MobileEmptyContentLoading/MobileEmptyContentLoading";
import MobileHeader from "../MobileHeader/MobileHeader";

import cn from "./MobileTriggerListPage.less";

type MobileTriggerListPageProps = {
    loading?: boolean,
    triggers: ?Array<Trigger>,
    selectedTags: ?Array<string>,
    onLoadMore: () => void,
    onOpenTagSelector: () => void,
};

function getViewPortHeight(): number {
    if (window.innerHeight) {
        return window.innerHeight;
    }
    if (document.documentElement && document.documentElement.clientHeight) {
        return document.documentElement.clientHeight;
    }
    if (document.body && document.body.clientHeight) {
        return document.body.clientHeight;
    }
    return 0;
}

function getWindowScrollPosition(): number {
    const doc = document.documentElement;
    return (window.pageYOffset || ((doc && doc.scrollTop) || 0)) - ((doc && doc.clientTop) || 0);
}

export default class MobileTriggerListPage extends React.Component<MobileTriggerListPageProps> {
    props: MobileTriggerListPageProps;
    rootElement: ?HTMLDivElement;

    handleScroll = () => {
        const { loading, onLoadMore } = this.props;
        if (loading || this.rootElement == null) {
            return;
        }
        const totalHeight = this.rootElement.getBoundingClientRect().height;
        if (totalHeight - (getWindowScrollPosition() + getViewPortHeight()) < 500) {
            onLoadMore();
        }
    };

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
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

    render(): React.Node {
        const { loading, triggers, onOpenTagSelector } = this.props;

        return (
            <div ref={x => (this.rootElement = x)}>
                <MobileHeader>
                    <MobileHeader.HeaderBlock>
                        <MobileHeader.LeftButton icon="Menu" />
                        <MobileHeader.Title>Moira: {this.renderTitle()}</MobileHeader.Title>
                        <MobileHeader.RightButton icon="Filter" onClick={onOpenTagSelector} />
                    </MobileHeader.HeaderBlock>
                </MobileHeader>
                <div className={cn("content")}>
                    {triggers == null && loading && <MobileEmptyContentLoading />}
                    {triggers != null &&
                        triggers.map(trigger => <MobileTriggerListItem key={trigger.id} data={trigger} />)}
                    {triggers != null && loading && (
                        <div>
                            <Spinner type="mini" caption="Loading..." />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
