// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import React, { ReactNode } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { LangCodes } from "@skbkontur/react-ui/lib/locale";
import { LocaleContext } from "@skbkontur/react-ui/lib/locale/LocaleContext";
import { getUnixTime } from "date-fns";
import CustomMaintenanceMenu from "../Components/MaintenanceSelect/CustomMaintenanceMenu/CustomMaintenanceMenu";

function Wrapper({ children }: { children: ReactNode }) {
    return (
        <LocaleContext.Provider value={{ langCode: LangCodes.en_GB }}>
            <div style={{ margin: "10px", width: "max-content" }}>{children}</div>
        </LocaleContext.Provider>
    );
}

storiesOf("MaintenanceSelect", module)
    .add("CustomMaintenanceMenu", () => (
        <Wrapper>
            <CustomMaintenanceMenu
                currentTime={new Date(2020, 5, 10, 6)}
                setMaintenance={action("setMaintenance")}
            />
        </Wrapper>
    ))
    .add("CustomMaintenanceMenu with initial maintenance", () => (
        <Wrapper>
            <CustomMaintenanceMenu
                currentTime={new Date(2020, 5, 9, 6)}
                maintenance={getUnixTime(new Date(2020, 6, 3, 2))}
                setMaintenance={action("setMaintenance")}
            />
        </Wrapper>
    ));
