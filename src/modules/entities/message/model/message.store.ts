import { create } from 'zustand';
import type { IMessage } from '../tpyes/message.type';

interface MessageState {
    messages: IMessage[];
    isLoading: boolean;
    addMessage: (message: Omit<IMessage, 'id' | 'timestamp'>) => Promise<void>;
    updateMessage: (id: string, content: string) => void;
    setMessageStreaming: (id: string, isStreaming: boolean) => void;
    clearMessages: () => void;
}

export const useMessageStore = create<MessageState>(set => ({
    isLoading: false,
    messages: [],
    async addMessage(message) {
        set({ isLoading: true })

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
        await new Promise(resolve => setTimeout(resolve, 1000))
        set({ isLoading: false })
    },
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
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
                        isDone: !isStreaming,
                    }
                    : msg,
            ),
        })),
    clearMessages: () => set({ messages: [] }),
}));
