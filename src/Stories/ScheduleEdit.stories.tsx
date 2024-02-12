import * as React from "react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import ScheduleEdit from "../Components/ScheduleEdit/ScheduleEdit";
import { createSchedule, WholeWeek } from "../Domain/Schedule";
import { Meta } from "@storybook/react";

const meta: Meta = {
    title: "ScheduleEdit",
    decorators: [(story) => <ValidationContainer>{story()}</ValidationContainer>],
};

export const Default = () => (
    <ScheduleEdit onChange={action("onChange")} schedule={createSchedule(WholeWeek)} />
);

export default meta;
