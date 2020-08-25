import * as React from "react";

type Props = {
    path: React.FunctionComponent<React.SVGAttributes<SVGElement>> | string;
    size: number;
    offsetTop: number;
};

export default function SvgIcon({ path, size, offsetTop }: Props): React.ReactElement {
    return (
        <img
            alt=""
            src={path as string}
            width={size}
            height={size}
            style={{ position: "relative", top: offsetTop }}
        />
    );
}
