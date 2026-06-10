import { action } from "storybook/actions";
import Toggle from "../Components/Toggle/Toggle";

export default {
    title: "Toggle",
};

export const Default = () => <Toggle label="Toggle" onChange={action("onChange")} />;
export const Checked = () => <Toggle checked label="Toggle" onChange={action("onChange")} />;
