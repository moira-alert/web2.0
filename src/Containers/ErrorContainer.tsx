import React, { ReactElement } from "react";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";

export default function ErrorContainer(message = "Page not found"): ReactElement {
    return (
        <Layout>
            <LayoutContent>
                <LayoutTitle>404</LayoutTitle>
                <p>{message}</p>
            </LayoutContent>
        </Layout>
    );
}
