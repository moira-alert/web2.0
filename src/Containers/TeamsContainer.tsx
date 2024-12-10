import React, { useEffect } from "react";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { Teams } from "../Components/Teams/Teams";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { useAppSelector } from "../store/hooks";
import { UIState } from "../store/selectors";

const TeamsContainer = () => {
    const { isLoading, error } = useAppSelector(UIState);

    useEffect(() => {
        setDocumentTitle("Teams");
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <LayoutTitle>Teams</LayoutTitle>
                <Teams />
            </LayoutContent>
        </Layout>
    );
};

export default TeamsContainer;
