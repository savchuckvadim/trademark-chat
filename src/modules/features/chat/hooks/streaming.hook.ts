import {
    useMessageStore,
    type IMessageAdd,
    type TMessageType,
} from '@/modules/entities';
import { useChatStore } from '../model/chat.store';
import { useCallback, useEffect, useRef } from 'react';
import { ChatStreamService } from '../services/chat-stream.service';

export const useStreaming = () => {
    const streamingRef = useRef<ChatStreamService | null>(null);

    const addMessage = useMessageStore(state => state.addMessage);
    const setMessageStreaming = useMessageStore(
        state => state.setMessageStreaming,
    );
    const updateMessage = useMessageStore(state => state.updateMessage);

    const isGenerating = useChatStore(state => state.isGenerating);
    const setIsGenerating = useChatStore(state => state.setIsGenerating);

    const startStreaming = useCallback(() => {
        const type: TMessageType = Math.random() > 0.5 ? 'text' : 'code';
        if (streamingRef.current) {
            streamingRef.current.stop();
        }

        const assistantMessage: IMessageAdd = {
            role: 'assistant' as const,
            content: '',
            createdAt: new Date(),
            isDone: false,
            chunks: [],
            type,
        };
        addMessage(assistantMessage);

        // Получаем ID сообщения после добавления (zustand обновляет синхронно)
        const messages = useMessageStore.getState().messages;
        const lastMessage = messages[messages.length - 1];

        if (!lastMessage) {
            console.error('Failed to create message');
            return;
        }

        const messageId = lastMessage.id;

        try {
            streamingRef.current = new ChatStreamService({
                targetWordsCount: 10000,
                interval: 15,
                type,
                onStart: () => {
                    setIsGenerating(true);
                    setMessageStreaming(messageId, true);
                },
                onChunk: chunk => {
                    updateMessage(messageId, chunk);
                },
                onComplete: () => {
                    // Убеждаемся, что все chunks сохранены перед завершением
                    const currentMessages = useMessageStore.getState().messages;
                    const currentMessage = currentMessages.find(
                        msg => msg.id === messageId,
                    );
                    if (currentMessage && currentMessage.chunks.length > 0) {
                        // Сохраняем финальный контент
                        setMessageStreaming(messageId, false);
                    }
                    setIsGenerating(false);
                },
                onStop: () => {
                    const currentMessages = useMessageStore.getState().messages;
                    const currentLast = currentMessages.find(
                        msg => msg.id === messageId,
                    );
                    if (currentLast) {
                        setMessageStreaming(messageId, false);
                    }
                    setIsGenerating(false);
                },
            });
        } catch (error) {
            console.error('Error creating ChatStreamService:', error);
            return;
        }

        setIsGenerating(true);
        streamingRef.current.start();
    }, [addMessage, setMessageStreaming, updateMessage, setIsGenerating]);

    const stopStreaming = useCallback(() => {
        if (streamingRef.current) {
            streamingRef.current.stop();
        }
        setIsGenerating(false);
    }, [setIsGenerating]);

    useEffect(() => {
        return () => {
            if (streamingRef.current) {
                streamingRef.current.stop();
            }
        };
    }, []);

    return { startStreaming, stopStreaming, isGenerating };
};
