import React, { FC, ReactNode } from "react";

export const WysiwygWrapper: FC<{ className?: string; children: ReactNode }> = ({
    className,
    children,
}) => <section className={`wysiwyg ${className ?? ""}`}>{children}</section>;
