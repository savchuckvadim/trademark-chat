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
        }));
    },

    updateMessage: (id, chunk) =>
        set(state => ({
            messages: state.messages.map(msg =>
                msg.id === id
                    ? { ...msg, chunks: [...msg.chunks, chunk] }
                    : msg,
            ),
        })),

    setMessageStreaming: (id, isStreaming) =>
        set(state => {
            return {
                messages: state.messages.map(msg => {
                    if (msg.id !== id) return msg;

                    // Если стриминг завершается, сохраняем chunks в content
                    if (!isStreaming) {
                        // Используем актуальные chunks из текущего состояния
                        const finalContent =
                            msg.chunks.length > 0
                                ? msg.chunks.join('')
                                : msg.content; // Fallback на существующий content

                        return {
                            ...msg,
                            isDone: true,
                            content: finalContent,
                            // Сохраняем chunks для истории, но content теперь основной источник
                            chunks: msg.chunks,
                        };
                    }

                    // Если стриминг начинается, сбрасываем content
                    return {
                        ...msg,
                        isDone: false,
                        content: '',
                    };
                }),
            };
        }),
    clearMessages: () => set({ messages: [] }),
}));
