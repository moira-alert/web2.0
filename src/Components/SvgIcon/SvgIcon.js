// @flow
import React from 'react';

type Props = {
    path: string;
    size: number;
    offsetTop?: number;
};

export default function SvgIcon({ path, size, offsetTop }: Props): React.Element<*> {
    return <img src={path} width={size} height={size} style={{ position: 'relative', top: offsetTop }} />;
}
