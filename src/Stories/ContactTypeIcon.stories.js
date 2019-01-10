// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { ContactTypes } from "../Domain/ContactType";
import ContactTypeIcon from "../Components/ContactTypeIcon/ContactTypeIcon";

storiesOf("ContactTypeIcon", module).add("AllIconsInList", () => (
    <div>
        {Object.keys(ContactTypes).map(x => (
            <ContactTypeIcon type={x} />
        ))}
    </div>
));
