import React from "react";
import { BrowserRouter } from "react-router-dom";
import AddingButton from "../Components/AddingButton/AddingButton";

export default {
    title: "AddingButton",
    component: AddingButton,
};

export const Default = () => (
    <BrowserRouter>
        <AddingButton to="/" />
    </BrowserRouter>
);
