import React from "react";
import cn from "./ErrorMessage.less";
import { ValidateTriggerTarget } from "../../../Domain/Trigger";

type ErrorMessageProps = {
    validateTarget?: ValidateTriggerTarget;
};

export default function ErrorMessage({
    validateTarget,
}: ErrorMessageProps): React.ReactElement | null {
    if (!validateTarget?.length) {
        return null;
    }

    return (
        <div className={cn.container}>
            {validateTarget?.map((validate, index) => (
                <div
                    className={cn("item", validate.level === "bad" ? "error" : "warning")}
                    key={index}
                >
                    {index + 1}) {validate.target}: {validate.msg}
                </div>
            ))}
            |
        </div>
    );
}
