import React, { ReactElement } from "react";
import Layout from "../Components/Layout/Layout";

export default {
    title: "Layout",
    component: Layout,
};

type Props = {
    width?: number | string;
    height?: number | string;
    label?: string;
};

function SpaceFiller({ width = 300, height = "100%", label = "Children" }: Props): ReactElement {
    return (
        <div
            style={{
                height,
                width,
                border: "1px solid #dee0e3",
                boxSizing: "border-box",
                color: "#000",
                display: "flex",
                flexFlow: "column",
                flex: "1 1 auto",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "repeating-linear-gradient(45deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05) 10px, rgba(255,255,255,0) 10px, rgba(255,255,255,0) 20px )",
            }}
        >
            {label}
        </div>
    );
}

export const Default = () => (
    <Layout>
        <Layout.Content>
            <SpaceFiller />
        </Layout.Content>
    </Layout>
);

export const WithError = () => (
    <Layout error="Error message here">
        <Layout.Content>
            <SpaceFiller />
        </Layout.Content>
    </Layout>
);

export const WithPlate = () => (
    <Layout>
        <Layout.Plate>
            <SpaceFiller height={50} label="Plate" />
        </Layout.Plate>
        <Layout.Content>
            <SpaceFiller />
        </Layout.Content>
    </Layout>
);

export const WithPaging = () => (
    <Layout>
        <Layout.Content>
            <SpaceFiller />
        </Layout.Content>
        <Layout.Footer>
            <SpaceFiller height={30} label="Paging" />
        </Layout.Footer>
    </Layout>
);

export const WithPlateAndPaging = () => (
    <Layout>
        <Layout.Plate>
            <SpaceFiller height={50} label="Plate" />
        </Layout.Plate>
        <Layout.Content>
            <SpaceFiller />
        </Layout.Content>
        <Layout.Footer>
            <SpaceFiller height={30} label="Paging" />
        </Layout.Footer>
    </Layout>
);
