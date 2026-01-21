import { create } from 'zustand';
import type { IMessage } from '../tpyes/message.type';

interface MessageState {
    messages: IMessage[];
    addMessage: (message: Omit<IMessage, 'id' | 'timestamp'>) => void;
    updateMessage: (id: string, content: string) => void;
    setMessageStreaming: (id: string, isStreaming: boolean) => void;
    clearMessages: () => void;
}

export const useMessageStore = create<MessageState>(set => ({
    messages: [],
    addMessage: message => {
        console.log('addMessage', message);
        return set(state => ({
            messages: [
                ...state.messages,
                {
                    ...message,
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                },
            ],
        }));
    },
    updateMessage: (id, content) =>
        set(state => ({
            messages: state.messages.map(msg =>
                msg.id === id ? { ...msg, content } : msg,
            ),
        })),
    setMessageStreaming: (id, isStreaming) =>
        set(state => ({
            messages: state.messages.map(msg =>
                msg.id === id
                    ? {
                          ...msg,
                          isStreaming,
                      }
                    : msg,
            ),
        })),
    clearMessages: () => set({ messages: [] }),
}));
