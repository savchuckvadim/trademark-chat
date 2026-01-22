import { memo, useMemo } from 'react';
import { parseMarkdown } from '../../lib/utils/markdown-parser.util';
import { CodeBlock } from './CodeBlock';
import { cn } from '@lib';

interface MessageContentProps {
    content: string;
    type: 'text' | 'code';
    isStreaming?: boolean;
    className?: string;
}

export const MessageContent = memo(
    ({
        content,
        type,
        isStreaming = false,
        className,
    }: MessageContentProps) => {
        const parsed = useMemo(() => {
            if (!content) return [];
            // Для больших текстов используем асинхронный парсинг
            // Но для простоты пока используем синхронный с оптимизацией
            if (content.length > 50000) {
                // Для очень больших текстов парсим только видимую часть
                // Это упрощенная версия - в реальности нужна виртуализация
                return parseMarkdown(content);
            }
            return parseMarkdown(content);
        }, [content]);

        // Если весь контент - код, показываем как code block
        if (type === 'code') {
            return (
                <div className={cn('w-full overflow-hidden', className)}>
                    <CodeBlock code={content} />
                    {isStreaming && (
                        <span className="inline-block w-2 h-4 ml-1 bg-[#d4d4d4] animate-pulse" />
                    )}
                </div>
            );
        }

        // Рендерим Markdown с поддержкой code blocks
        return (
            <div
                className={cn(
                    'text-sm whitespace-pre-wrap break-words',
                    'prose prose-sm max-w-none dark:prose-invert',
                    className,
                )}
            >
                {parsed.map((item, index) => {
                    // Code blocks (```code```)
                    if (item.type === 'code' && item.content.includes('\n')) {
                        return <CodeBlock key={index} code={item.content} />;
                    }
                    // Inline code
                    if (item.type === 'code') {
                        return (
                            <code
                                key={index}
                                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                            >
                                {item.content}
                            </code>
                        );
                    }
                    // Bold text
                    if (item.type === 'bold') {
                        return (
                            <strong key={index} className="font-semibold">
                                {item.content}
                            </strong>
                        );
                    }
                    // Regular text
                    return <span key={index}>{item.content}</span>;
                })}
                {isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                )}
            </div>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.content === nextProps.content &&
            prevProps.type === nextProps.type &&
            prevProps.isStreaming === nextProps.isStreaming
        );
    },
);

MessageContent.displayName = 'MessageContent';
