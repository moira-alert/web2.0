import { Status } from "../../../Domain/Status";
import { IconCheckCircleSolid20 } from "@skbkontur/icons/IconCheckCircleSolid20";
import { IconWarningCircleSolid20 } from "@skbkontur/icons/IconWarningCircleSolid20";
import { IconXCircleSolid20 } from "@skbkontur/icons/IconXCircleSolid20";
import { IconMinusCircleSolid20 } from "@skbkontur/icons/IconMinusCircleSolid20";
import { IconXSolid20 } from "@skbkontur/icons/IconXSolid20";
import { ReactElement } from "react";

export const COLORBLIND_ICONS: Record<Status, (size: number, color: string) => ReactElement> = {
    [Status.OK]: (size, color) => (
        <IconCheckCircleSolid20 size={size} color={color} align="baseline" />
    ),
    [Status.WARN]: (size, color) => <IconWarningCircleSolid20 size={size} color={color} />,
    [Status.ERROR]: (size, color) => <IconXCircleSolid20 size={size} color={color} />,
    [Status.EXCEPTION]: (size, color) => <IconXCircleSolid20 size={size} color={color} />,
    [Status.NODATA]: (size, color) => <IconMinusCircleSolid20 size={size} color={color} />,
    [Status.DEL]: (size, color) => <IconXSolid20 size={size} color={color} />,
};
