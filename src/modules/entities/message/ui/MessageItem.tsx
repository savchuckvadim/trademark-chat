import { memo } from 'react';
import { cn } from '@lib';
import type { IMessage } from '../tpyes/message.type';

interface MessageItemProps {
    message: IMessage;
}

export const MessageItem = memo(
    ({ message }: MessageItemProps) => {
        const isUser = message.role === 'user';

        return (
            <div
                className={cn(
                    'flex w-full',
                    isUser ? 'justify-end' : 'justify-start',
                )}
            >
                <div
                    className={cn(
                        'max-w-[80%] rounded-lg px-4 py-2 border border-primary min-w-1/4',
                        isUser
                            ? 'bg-card text-primary-foreground'
                            : 'bg-muted text-foreground',
                    )}
                >
                    <div className="text-sm whitespace-pre-wrap break-words prose prose-sm max-w-none dark:prose-invert" />
                    {!message.isDone && message.chunks.length > 0 && (
                        <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
                    )}
                    {message.isDone && message.content && (
                        <div className="text-sm whitespace-pre-wrap break-words prose prose-sm max-w-none dark:prose-invert">
                            {message.content}
                        </div>
                    )}
                    <p className="text-[8px] text-muted-foreground text-right">
                        {message.createdAt.toLocaleString()}
                    </p>
                </div>
            </div>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.message.id === nextProps.message.id &&
            prevProps.message.content === nextProps.message.content &&
            prevProps.message.isDone === nextProps.message.isDone
        );
    },
);

MessageItem.displayName = 'MessageItem';
