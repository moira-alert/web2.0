import { IconCheckARegular16 } from "@skbkontur/icons/IconCheckARegular16";
import RouterLink from "../Components/RouterLink/RouterLink";

export default {
    title: "RouterLink",
};

export const Default = () => <RouterLink to="/">Link</RouterLink>;

export const WithIcon = {
    render: () => (
        <RouterLink to="/" icon={<IconCheckARegular16 />}>
            Link
        </RouterLink>
    ),

    name: "With icon",
};
