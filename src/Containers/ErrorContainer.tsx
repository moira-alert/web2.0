import React, { ReactElement } from "react";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";

interface IErrorContainerProps {
    message?: string;
    title?: string;
}

export default function ErrorContainer({
    message = "Page not found",
    title = "404",
}: IErrorContainerProps): ReactElement {
    return (
        <Layout>
            <LayoutContent>
                <LayoutTitle>{title}</LayoutTitle>
                <p>{message}</p>
            </LayoutContent>
        </Layout>
    );
}
