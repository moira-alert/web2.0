import React, { ReactElement } from "react";
import { storiesOf } from "@storybook/react";
import { Layout, LayoutContent, LayoutFooter, LayoutPlate } from "../Components/Layout/Layout";

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
            <LayoutContent>
                <SpaceFiller />
            </LayoutContent>
        </Layout>
    ))
    .add("With Error", () => (
        <Layout error="Error message here">
            <LayoutContent>
                <SpaceFiller />
            </LayoutContent>
        </Layout>
    ))
    .add("With Plate", () => (
        <Layout>
            <LayoutPlate>
                <SpaceFiller height={50} label="Plate" />
            </LayoutPlate>
            <LayoutContent>
                <SpaceFiller />
            </LayoutContent>
        </Layout>
    ))
    .add("With Paging", () => (
        <Layout>
            <LayoutContent>
                <SpaceFiller />
            </LayoutContent>
            <LayoutFooter>
                <SpaceFiller height={30} label="Paging" />
            </LayoutFooter>
        </Layout>
    ))
    .add("With Plate and paging", () => (
        <Layout>
            <LayoutPlate>
                <SpaceFiller height={50} label="Plate" />
            </LayoutPlate>
            <LayoutContent>
                <SpaceFiller />
            </LayoutContent>
            <LayoutFooter>
                <SpaceFiller height={30} label="Paging" />
            </LayoutFooter>
        </Layout>
    ));
