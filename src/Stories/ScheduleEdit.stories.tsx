import React from "react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import ScheduleEdit from "../Components/ScheduleEdit/ScheduleEdit";
import { createSchedule, WholeWeek } from "../Domain/Schedule";

export default {
    title: "ScheduleEdit",
    component: ScheduleEdit,
};

export const Default = () => (
    <ValidationContainer>
        <ScheduleEdit onChange={action("onChange")} schedule={createSchedule(WholeWeek)} />
    </ValidationContainer>
);
