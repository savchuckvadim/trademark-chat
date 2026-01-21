import { memo, useMemo, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { useMessageStore } from '../model/message.store';

export const MessageList = memo(() => {
    const messages = useMessageStore(state => state.messages);
    const containerRef = useRef<HTMLDivElement>(null);

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
            className="flex flex-col gap-4 p-4 overflow-y-auto flex-1"
        >
            {messageItems}
        </div>
    );
});

MessageList.displayName = 'MessageList';
