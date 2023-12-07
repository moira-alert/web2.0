import React, { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

import { purifyConfig } from "../../Domain/DOMPurify";

interface IProps {
    markdown: string;
    className?: string;
}

export const Markdown: FC<IProps> = ({ markdown, className }) => {
    return (
        <ReactMarkdown
            linkTarget="_blank"
            className={className}
            disallowedElements={purifyConfig}
            remarkPlugins={[remarkBreaks]}
        >
            {markdown}
        </ReactMarkdown>
    );
};
