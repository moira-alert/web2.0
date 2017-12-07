// @flow
import * as React from "react";
import Icon from "retail-ui/components/Icon";
import Spinner from "retail-ui/components/Spinner";

import type { TriggerList } from "../../../Domain/Trigger";

import MobileTriggerListItem from "../MobileTriggerListItem/MobileTriggerListItem";
import MobileEmptyContentLoading from "../MobileEmptyContentLoading/MobileEmptyContentLoading";
import MobileHeader from "../MobileHeader/MobileHeader";

import cn from "./MobileTriggerListPage.less";

type MobileTriggerListPageProps = {
    loading: boolean,
    triggers: ?TriggerList,
    selectedTags: ?Array<string>,
    onLoadMore: () => void,
};

function getViewPortHeight(): number {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

function getWindowScrollPosition(): number {
    const doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
}

export default class MobileTriggerListPage extends React.Component<MobileTriggerListPageProps> {
    props: MobileTriggerListPageProps;
    rootElement: ?HTMLDivElement;

    handleScroll = () => {
        const { loading, onLoadMore } = this.props;
        if (loading) {
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

    render(): React.Node {
        const { loading, triggers, selectedTags } = this.props;

        return (
            <div ref={x => (this.rootElement = x)}>
                <MobileHeader>
                    <MobileHeader.HeaderBlock>
                        <MobileHeader.LeftButton icon="Menu" />
                        <MobileHeader.Title>
                            Moira: {selectedTags.length === 0 ? "All triggers" : "Subscribed"}
                        </MobileHeader.Title>
                    </MobileHeader.HeaderBlock>
                </MobileHeader>
                <div className={cn("content")}>
                    {triggers == null && loading && <MobileEmptyContentLoading />}
                    {triggers != null && triggers.map(trigger => <MobileTriggerListItem data={trigger} />)}
                    {triggers != null &&
                        loading && (
                            <div>
                                <Spinner type="mini" caption="Loading..." />
                            </div>
                        )}
                </div>
            </div>
        );
    }
}
