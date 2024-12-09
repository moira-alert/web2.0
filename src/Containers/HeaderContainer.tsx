import React from "react";
import Bar from "../Components/Bar/Bar";
import Header from "../Components/Header/Header";
import MoiraServiceStates from "../Domain/MoiraServiceStates";
import { useGetNotifierStateQuery } from "../services/NotifierApi";

interface IHeaderContainerProps {
    className: string;
}

export const HeaderContainer: React.FC<IHeaderContainerProps> = ({ className }) => {
    const { data: notifierState } = useGetNotifierStateQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const notifierStateMessage =
        notifierState?.state === MoiraServiceStates.ERROR ? notifierState?.message : undefined;

    return (
        <div className={className}>
            {notifierStateMessage && <Bar message={notifierStateMessage} />}
            <Header />
        </div>
    );
};
