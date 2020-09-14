import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import ScheduleEdit from "../Components/ScheduleEdit/ScheduleEdit";
import { createSchedule, WholeWeek } from "../Domain/Schedule";

storiesOf("ScheduleEdit", module)
    .addDecorator((story) => <ValidationContainer>{story()}</ValidationContainer>)
    .add("Default", () => (
        <ScheduleEdit onChange={action("onChange")} schedule={createSchedule(WholeWeek)} />
    ));
