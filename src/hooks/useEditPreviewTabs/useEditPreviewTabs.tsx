import React, { useState, FC } from "react";
import classNames from "classnames/bind";
import { Tabs } from "@skbkontur/react-ui";

import styles from "./EditPreviewTabs.module.less";

const cn = classNames.bind(styles);

interface EditPreviewTabsHookResult {
    descriptionView: "edit" | "preview";
    EditPreviewComponent: FC;
}

export const useEditPreviewTabs = (): EditPreviewTabsHookResult => {
    const [descriptionView, setDescriptionView] = useState<"edit" | "preview">("edit");

    const EditPreviewComponent = () => (
        <div className={cn("description-mode-tabs")}>
            <Tabs value={descriptionView} onValueChange={(value) => setDescriptionView(value)}>
                <Tabs.Tab id="edit" data-tid="Description Edit">
                    Edit
                </Tabs.Tab>
                <Tabs.Tab id="preview" data-tid="Description Preview">
                    Preview
                </Tabs.Tab>
            </Tabs>
        </div>
    );

    return { descriptionView, EditPreviewComponent };
};
