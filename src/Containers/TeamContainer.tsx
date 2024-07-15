import React, { FC, useEffect } from "react";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { TeamWithUsers } from "./TeamWithUsers";
import { useAppSelector } from "../store/hooks";
import { UIState } from "../store/selectors";

export const TeamContainer: FC = () => {
    const { isLoading, error } = useAppSelector(UIState);

    useEffect(() => {
        setDocumentTitle("Team");
    }, []);

    return (
        <Layout loading={isLoading} error={error as string}>
            <LayoutContent>
                <LayoutTitle>Team</LayoutTitle>
                <LayoutContent>
                    <TeamWithUsers />
                </LayoutContent>
            </LayoutContent>
        </Layout>
    );
};
