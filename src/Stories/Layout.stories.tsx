import React, { ReactElement } from "react";
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

export default {
    title: "Layout",
};

export const Default = () => (
    <Layout>
        <LayoutContent>
            <SpaceFiller />
        </LayoutContent>
    </Layout>
);

export const WithError = () => (
    <Layout error="Error message here">
        <LayoutContent>
            <SpaceFiller />
        </LayoutContent>
    </Layout>
);

export const WithPlate = () => (
    <Layout>
        <LayoutPlate>
            <SpaceFiller height={50} label="Plate" />
        </LayoutPlate>
        <LayoutContent>
            <SpaceFiller />
        </LayoutContent>
    </Layout>
);

export const WithPaging = () => (
    <Layout>
        <LayoutContent>
            <SpaceFiller />
        </LayoutContent>
        <LayoutFooter>
            <SpaceFiller height={30} label="Paging" />
        </LayoutFooter>
    </Layout>
);

export const WithPlateAndPaging = () => (
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
);
