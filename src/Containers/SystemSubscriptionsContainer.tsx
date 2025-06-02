import React, { useEffect, FC } from "react";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { UIState } from "../store/selectors";
import { useAppSelector } from "../store/hooks";
import { useGetSystemSubscriptionsQuery } from "../services/SubscriptionsApi";
import { SystemSubscriptionsList } from "../Components/SystemSubscriptionsList";

export const SystemSubscriptionsContainer: FC = () => {
    const { error, isLoading } = useAppSelector(UIState);
    const { data: systemSubscriptions = [] } = useGetSystemSubscriptionsQuery();

    useEffect(() => {
        setDocumentTitle("System Subscriptions");
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <LayoutTitle>System subscriptions: {systemSubscriptions?.length}</LayoutTitle>
                {systemSubscriptions?.length > 0 && (
                    <SystemSubscriptionsList systemSubscriptions={systemSubscriptions} />
                )}
            </LayoutContent>
        </Layout>
    );
};
