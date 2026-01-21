import { useEffect } from 'react';

export const useChatInputScroll = (
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    input: string,
) => {
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Сбрасываем высоту, чтобы получить правильный scrollHeight
        textarea.style.height = 'auto';

        // Устанавливаем новую высоту на основе содержимого
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 200; // Максимальная высота в пикселях (примерно 8-9 строк)

        if (scrollHeight <= maxHeight) {
            textarea.style.height = `${scrollHeight}px`;
            textarea.style.overflowY = 'hidden';
        } else {
            textarea.style.height = `${maxHeight}px`;
            textarea.style.overflowY = 'auto';
        }
    }, [input]);
};
