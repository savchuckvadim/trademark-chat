import { create } from 'zustand';
import type { IMessage, IMessageAdd } from '../tpyes/message.type';

interface MessageState {
    messages: IMessage[];
    isLoading: boolean;
    addMessage: (message: IMessageAdd) => void;
    updateMessage: (id: string, content: string) => void;
    setMessageStreaming: (id: string, isStreaming: boolean) => void;
    clearMessages: () => void;
}

export const useMessageStore = create<MessageState>(set => ({
    isLoading: false,
    messages: [],
    addMessage(message) {

        set(state => ({
            messages: [
                ...state.messages,
                {
                    ...message,
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                },
            ],
        }))

    },

    updateMessage: (id, chunk) =>
        set(state => ({
            messages: state.messages.map(msg =>
                msg.id === id ? { ...msg, chunks: [...msg.chunks, chunk] } : msg,
            ),
        })),


    setMessageStreaming: (id, isStreaming) =>
        set(state => ({
            messages: state.messages.map(msg =>
                msg.id === id
                    ? {
                        ...msg,
                        isDone: !isStreaming,
                        chunks: isStreaming ? [...msg.chunks, ''] : [],
                        content: !isStreaming ? msg.chunks.join('') : '',
                    }
                    : msg,
            ),
        })),
    clearMessages: () => set({ messages: [] }),
}));
