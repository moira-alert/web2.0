import React from "react";
import Bar from "../Components/Bar/Bar";
import Header from "../Components/Header/Header";
import MoiraServiceStates from "../Domain/MoiraServiceStates";
import { useGetNotifierSourcesStateQuery, useGetNotifierStateQuery } from "../services/NotifierApi";

interface IHeaderContainerProps {
    className: string;
}

export const HeaderContainer: React.FC<IHeaderContainerProps> = ({ className }) => {
    const { data: notifierState } = useGetNotifierStateQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const { data: notifierSourcesState } = useGetNotifierSourcesStateQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const downSources =
        notifierSourcesState?.filter((source) => source.state === MoiraServiceStates.ERROR) ?? [];

    const getSourcesMessage = () => {
        if (downSources.length === 1) {
            return downSources[0].message;
        }

        if (downSources.length > 1) {
            const sources = downSources
                .map((s) => `${s.trigger_source}.${s.cluster_id}`)
                .join(", ");
            return `Notification mailing for Moira metric sources: ${sources} is not available.`;
        }

        return null;
    };

    const sourcesMessage = getSourcesMessage();

    const notifierStateMessage =
        notifierState?.state === MoiraServiceStates.ERROR ? notifierState?.message : null;

    const messageToShow = notifierStateMessage ?? sourcesMessage;

    return (
        <div className={className}>
            {messageToShow && <Bar message={messageToShow} />}
            <Header />
        </div>
    );
};
