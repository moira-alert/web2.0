import React, { FC } from "react";
import { Markdown as KonturMarkdown, MarkdownProps } from "@skbkontur/markdown";
import { WysiwygWrapper } from "./WysiwygWrapper";
import { MarkdownTheme } from "./MarkdownTheme";

export const Markdown: FC<MarkdownProps> = (props) => {
    return (
        <WysiwygWrapper>
            <MarkdownTheme>
                <KonturMarkdown {...props} />
            </MarkdownTheme>
        </WysiwygWrapper>
    );
};
