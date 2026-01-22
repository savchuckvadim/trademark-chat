import { useEffect, useRef, useState } from 'react';

interface UseAutoScrollOptions {
    isGenerating: boolean;
    messagesCount: number;
    chunksCount?: number;
    enabled?: boolean;
}

/**
 * Хук для автоскролла к низу списка сообщений
 * Автоматически отключается, если пользователь начал скроллить вверх
 */
export const useAutoScroll = ({
    isGenerating,
    messagesCount,
    chunksCount = 0,
    enabled = true,
}: UseAutoScrollOptions) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
    const userScrolledRef = useRef(false);
    const lastMessagesCountRef = useRef(messagesCount);
    const lastChunksCountRef = useRef(chunksCount);

    // Проверяем, находится ли пользователь внизу списка
    const isAtBottom = () => {
        if (!containerRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const threshold = 100; // Порог в пикселях от низа
        return scrollHeight - scrollTop - clientHeight < threshold;
    };

    // Скроллим к низу
    const scrollToBottom = (smooth = false) => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const targetScroll = container.scrollHeight - container.clientHeight;

        // Используем scrollTop напрямую для более надежного скролла
        if (smooth) {
            container.scrollTo({
                top: targetScroll,
                behavior: 'smooth',
            });
        } else {
            // Для быстрого скролла используем прямое присваивание
            container.scrollTop = targetScroll;
        }
    };

    // Отслеживаем скролл пользователя
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (!isAtBottom()) {
                userScrolledRef.current = true;
                setAutoScrollEnabled(false);
            } else if (userScrolledRef.current && isAtBottom()) {
                // Пользователь вернулся вниз - включаем автоскролл снова
                userScrolledRef.current = false;
                setAutoScrollEnabled(true);
            }
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Автоскролл при генерации
    useEffect(() => {
        if (!enabled || !autoScrollEnabled) return;

        // Проверяем изменения: новое сообщение, новый chunk или идет генерация
        const hasNewMessage = messagesCount !== lastMessagesCountRef.current;
        const hasNewChunk = chunksCount !== lastChunksCountRef.current;

        if (hasNewMessage || hasNewChunk || isGenerating) {
            // Используем двойной requestAnimationFrame для гарантированного скролла
            // после того как DOM обновится
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Для стриминга используем auto (быстрее), для новых сообщений - smooth
                    scrollToBottom(!isGenerating || !hasNewChunk);
                });
            });
        }

        lastMessagesCountRef.current = messagesCount;
        lastChunksCountRef.current = chunksCount;
    }, [isGenerating, messagesCount, chunksCount, enabled, autoScrollEnabled]);

    // Сбрасываем флаг при остановке генерации
    useEffect(() => {
        if (!isGenerating) {
            userScrolledRef.current = false;
            setAutoScrollEnabled(true);
        }
    }, [isGenerating]);

    return {
        containerRef,
        scrollToBottom: () => scrollToBottom(true),
    };
};
