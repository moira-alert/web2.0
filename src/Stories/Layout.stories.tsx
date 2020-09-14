import React, { ReactElement } from "react";
import { storiesOf } from "@storybook/react";
import Layout from "../Components/Layout/Layout";

type Props = {
    width?: number | string;
    height?: number | string;
    label?: string;
};

function SpaceFiller(props: Props): ReactElement {
    const { width = "100%", height = 300, label = "Children" } = props;
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

SpaceFiller.defaultProps = {
    width: 300,
    height: "100%",
    label: "Children",
};

storiesOf("Layout", module)
    .add("Default", () => (
        <Layout>
            <Layout.Content>
                <SpaceFiller />
            </Layout.Content>
        </Layout>
    ))
    .add("With Error", () => (
        <Layout error="Error message here">
            <Layout.Content>
                <SpaceFiller />
            </Layout.Content>
        </Layout>
    ))
    .add("With Plate", () => (
        <Layout>
            <Layout.Plate>
                <SpaceFiller height={50} label="Plate" />
            </Layout.Plate>
            <Layout.Content>
                <SpaceFiller />
            </Layout.Content>
        </Layout>
    ))
    .add("With Paging", () => (
        <Layout>
            <Layout.Content>
                <SpaceFiller />
            </Layout.Content>
            <Layout.Footer>
                <SpaceFiller height={30} label="Paging" />
            </Layout.Footer>
        </Layout>
    ))
    .add("With Plate and paging", () => (
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
    ));
