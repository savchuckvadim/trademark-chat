import { memo, useMemo } from 'react';
import { cn } from '@lib';
import type { IMessage } from '../tpyes/message.type';
import { MessageContent } from './components/MessageContent';

interface MessageItemProps {
    message: IMessage;
}

export const MessageItem = memo(
    ({ message }: MessageItemProps) => {
        const isUser = message.role === 'user';

        // Объединяем chunks для отображения во время стриминга
        const streamingContent = useMemo(() => {
            if (message.isDone || message.chunks.length === 0) {
                return '';
            }
            return message.chunks.join('');
        }, [message.chunks, message.isDone]);

        // Используем content для завершенных сообщений, иначе chunks
        const displayContent = message.isDone
            ? message.content
            : streamingContent;
        const isStreaming = !message.isDone && message.chunks.length > 0;

        return (
            <div
                className={cn(
                    'flex w-full mb-4',
                    isUser ? 'justify-end' : 'justify-start',
                )}
            >
                <div
                    className={cn(
                        'max-w-[80%] rounded-lg px-4 py-3 border',
                        'break-words overflow-wrap-anywhere',
                        message.type === 'code' && 'overflow-hidden',
                        isUser
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-foreground border-border',
                    )}
                >
                    <MessageContent
                        content={displayContent || ''}
                        type={message.type}
                        isStreaming={isStreaming}
                    />
                    <p className="text-[10px] text-muted-foreground text-right mt-2">
                        {message.createdAt.toLocaleString()}
                    </p>
                </div>
            </div>
        );
    },
    (prevProps, nextProps) => {
        // Оптимизированное сравнение для предотвращения лишних рендеров
        const prev = prevProps.message;
        const next = nextProps.message;

        // Если это разные сообщения, всегда рендерим
        if (prev.id !== next.id) return false;

        // Если изменился статус isDone, рендерим
        if (prev.isDone !== next.isDone) return false;

        // Если изменился тип, рендерим
        if (prev.type !== next.type) return false;

        // Если сообщение завершено, сравниваем только content
        if (prev.isDone) {
            return prev.content === next.content;
        }

        // Для стриминга сравниваем длину chunks и последний chunk
        // Это оптимизация - не сравниваем весь массив для производительности
        return (
            prev.chunks.length === next.chunks.length &&
            (prev.chunks.length === 0 ||
                prev.chunks[prev.chunks.length - 1] ===
                    next.chunks[next.chunks.length - 1])
        );
    },
);

MessageItem.displayName = 'MessageItem';
