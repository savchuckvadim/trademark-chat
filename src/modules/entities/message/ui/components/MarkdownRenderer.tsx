import { memo, useMemo } from 'react';
import {
    parseMarkdown,
    type ParsedMarkdown,
} from '../../lib/utils/markdown-parser.util';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export const MarkdownRenderer = memo(
    ({ content, className = '' }: MarkdownRendererProps) => {
        const parsed = useMemo(() => {
            return parseMarkdown(content);
        }, [content]);

        return (
            <div className={className}>
                {parsed.map((item, index) => {
                    if (item.type === 'code') {
                        return (
                            <code
                                key={index}
                                className="bg-muted px-1 py-0.5 rounded text-sm font-mono"
                            >
                                {item.content}
                            </code>
                        );
                    }
                    if (item.type === 'bold') {
                        return (
                            <strong key={index} className="font-semibold">
                                {item.content}
                            </strong>
                        );
                    }
                    return <span key={index}>{item.content}</span>;
                })}
            </div>
        );
    },
    (prevProps, nextProps) => {
        return prevProps.content === nextProps.content;
    },
);

MarkdownRenderer.displayName = 'MarkdownRenderer';
