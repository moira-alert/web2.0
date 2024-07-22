import React, { ReactNode } from "react";
import { action } from "@storybook/addon-actions";
import { LangCodes } from "@skbkontur/react-ui/lib/locale";
import { LocaleContext } from "@skbkontur/react-ui/lib/locale/LocaleContext";
import { addMonths, getUnixTime, lastDayOfMonth } from "date-fns";
import CustomMaintenanceMenu from "../Components/MaintenanceSelect/CustomMaintenanceMenu/CustomMaintenanceMenu";

function Wrapper({ children }: { children: ReactNode }) {
    return (
        <LocaleContext.Provider value={{ langCode: LangCodes.en_GB }}>
            <div style={{ margin: "10px", width: "max-content" }}>{children}</div>
        </LocaleContext.Provider>
    );
}

export default {
    title: "MaintenanceSelect",
};
const date = new Date(2020, 5, 10, 6);
export const _CustomMaintenanceMenu = () => {
    return (
        <Wrapper>
            <CustomMaintenanceMenu
                minDate={date}
                maxDate={lastDayOfMonth(addMonths(date, 1))}
                currentDate={date}
                setMaintenance={action("setMaintenance")}
            />
        </Wrapper>
    );
};

export const CustomMaintenanceMenuWithInitialMaintenance = {
    render: () => (
        <Wrapper>
            <CustomMaintenanceMenu
                minDate={date}
                maxDate={lastDayOfMonth(addMonths(date, 1))}
                maintenance={getUnixTime(new Date(2020, 6, 3, 2))}
                setMaintenance={action("setMaintenance")}
            />
        </Wrapper>
    ),

    name: "Custommaintenancemenu with initial maintenance",
};
