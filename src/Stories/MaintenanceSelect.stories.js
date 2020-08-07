// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import CustomMaintenanceMenu from "../Components/MaintenanceSelect/CustomMaintenanceMenu/CustomMaintenanceMenu";

storiesOf("MaintenanceSelect", module)
    .addParameters({
        creevey: {
            skip: {
                stories: "CustomMaintenanceMenu",
                reasons: "Dynamic current date",
            },
        },
    })
    .add("CustomMaintenanceMenu", () => (
        <div style={{ margin: "10px", width: "max-content" }}>
            <CustomMaintenanceMenu />
        </div>
    ));
