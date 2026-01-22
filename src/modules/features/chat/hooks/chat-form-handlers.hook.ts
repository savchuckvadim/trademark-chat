import { useCallback } from 'react';
import { useStreaming } from './streaming.hook';

export const useChatFormHandlers = () => {
    const { isGenerating, startStreaming, stopStreaming } = useStreaming();

    const handleFormSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            if (isGenerating) {
                stopStreaming();
            } else {
                startStreaming();
            }
        },
        [isGenerating, startStreaming, stopStreaming],
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            // Enter отправляет форму, Shift+Enter создает новую строку
            if (e.key === 'Enter' && !e.shiftKey && !isGenerating) {
                e.preventDefault();
                startStreaming();
            }
        },
        [isGenerating, startStreaming],
    );

    return {
        isGenerating,
        handleFormSubmit,
        handleKeyDown,
    };
};
