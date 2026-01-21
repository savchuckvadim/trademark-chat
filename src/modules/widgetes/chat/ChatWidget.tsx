import { MessageList } from '@/modules/entities';
import { ChatInput } from '@/modules/features/';

export const ChatWidget = () => {
    return (
        <div className="flex flex-col h-screen bg-background">
            <div className="flex-1 overflow-hidden">
                <MessageList />
            </div>

            <ChatInput />
        </div>
    );
};
