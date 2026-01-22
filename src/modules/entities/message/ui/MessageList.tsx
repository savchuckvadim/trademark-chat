import { memo, useMemo } from 'react';
import { MessageItem } from './MessageItem';
import { useMessageStore } from '../model/message.store';
import { useAutoScroll } from '../hooks/use-auto-scroll.hook';
import { useChatStore } from '@/modules/features/chat/model/chat.store';

export const MessageList = memo(() => {
    const messages = useMessageStore(state => state.messages);
    const isGenerating = useChatStore(state => state.isGenerating);

    // Отслеживаем изменения в chunks последнего сообщения для автоскролла
    const lastMessageChunksCount = useMemo(() => {
        const lastMessage = messages[messages.length - 1];
        return lastMessage?.chunks.length || 0;
    }, [messages]);

    const { containerRef } = useAutoScroll({
        isGenerating,
        messagesCount: messages.length,
        chunksCount: lastMessageChunksCount,
        enabled: true,
    });

    const messageItems = useMemo(
        () =>
            messages.map(message => (
                <MessageItem key={message.id} message={message} />
            )),
        [messages],
    );

    return (
        <div
            ref={containerRef}
            className="flex flex-col gap-2 p-4 overflow-y-auto h-full"
        >
            {messageItems}
        </div>
    );
});

MessageList.displayName = 'MessageList';
