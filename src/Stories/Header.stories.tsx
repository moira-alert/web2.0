import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "../Components/Header/Header";

export default {
    title: "Header",
    component: Header,
};

export const Default = () => (
    <BrowserRouter>
        <Header />
    </BrowserRouter>
);
