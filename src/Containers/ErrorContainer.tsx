import React, { ReactElement } from "react";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";

export default function ErrorContainer(): ReactElement {
    return (
        <Layout>
            <LayoutContent>
                <LayoutTitle>404</LayoutTitle>
                <p>Page not found</p>
            </LayoutContent>
        </Layout>
    );
}
