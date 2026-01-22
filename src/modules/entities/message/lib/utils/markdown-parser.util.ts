/**
 * Легковесный Markdown парсер для code blocks и bold
 * Использует простую регулярную замену для минимальной нагрузки на main thread
 */

export interface ParsedMarkdown {
    type: 'text' | 'code' | 'bold';
    content: string;
}

/**
 * Парсит Markdown текст на токены
 * Оптимизирован для больших объемов текста
 */
export const parseMarkdown = (text: string): ParsedMarkdown[] => {
    if (!text) return [];

    const result: ParsedMarkdown[] = [];
    let currentIndex = 0;
    const textLength = text.length;

    // Регулярные выражения для поиска паттернов
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const inlineCodeRegex = /`([^`]+)`/g;

    // Собираем все совпадения с их позициями
    const matches: Array<{
        start: number;
        end: number;
        type: 'code' | 'bold' | 'inlineCode';
        content: string;
    }> = [];

    // Находим code blocks
    let match: RegExpExecArray | null;
    while ((match = codeBlockRegex.exec(text)) !== null) {
        matches.push({
            start: match.index,
            end: match.index + match[0].length,
            type: 'code',
            content: match[1],
        });
    }

    // Находим inline code (только вне code blocks)
    inlineCodeRegex.lastIndex = 0;
    while ((match = inlineCodeRegex.exec(text)) !== null) {
        const currentMatch = match; // Сохраняем для использования в callback
        const isInsideCodeBlock = matches.some(
            m =>
                m.type === 'code' &&
                currentMatch.index >= m.start &&
                currentMatch.index < m.end,
        );
        if (!isInsideCodeBlock) {
            matches.push({
                start: currentMatch.index,
                end: currentMatch.index + currentMatch[0].length,
                type: 'inlineCode',
                content: currentMatch[1],
            });
        }
    }

    // Находим bold (только вне code blocks)
    boldRegex.lastIndex = 0;
    while ((match = boldRegex.exec(text)) !== null) {
        const currentMatch = match; // Сохраняем для использования в callback
        const isInsideCodeBlock = matches.some(
            m =>
                m.type === 'code' &&
                currentMatch.index >= m.start &&
                currentMatch.index < m.end,
        );
        if (!isInsideCodeBlock) {
            matches.push({
                start: currentMatch.index,
                end: currentMatch.index + currentMatch[0].length,
                type: 'bold',
                content: currentMatch[1],
            });
        }
    }

    // Сортируем совпадения по позиции
    matches.sort((a, b) => a.start - b.start);

    // Строим результат
    for (const matchItem of matches) {
        // Добавляем текст до совпадения
        if (matchItem.start > currentIndex) {
            const textBefore = text.slice(currentIndex, matchItem.start);
            if (textBefore) {
                result.push({ type: 'text', content: textBefore });
            }
        }

        // Добавляем совпадение
        if (matchItem.type === 'code') {
            result.push({ type: 'code', content: matchItem.content });
        } else if (matchItem.type === 'inlineCode') {
            result.push({ type: 'code', content: matchItem.content });
        } else if (matchItem.type === 'bold') {
            result.push({ type: 'bold', content: matchItem.content });
        }

        currentIndex = matchItem.end;
    }

    // Добавляем оставшийся текст
    if (currentIndex < textLength) {
        const remainingText = text.slice(currentIndex);
        if (remainingText) {
            result.push({ type: 'text', content: remainingText });
        }
    }

    // Если не было совпадений, возвращаем весь текст как обычный
    if (result.length === 0) {
        result.push({ type: 'text', content: text });
    }

    return result;
};

/**
 * Парсит Markdown в Web Worker (для больших объемов текста)
 */
export const parseMarkdownAsync = async (
    text: string,
): Promise<ParsedMarkdown[]> => {
    // Для небольших текстов используем синхронный парсинг
    if (text.length < 10000) {
        return parseMarkdown(text);
    }

    // Для больших текстов используем requestIdleCallback или setTimeout
    return new Promise(resolve => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                resolve(parseMarkdown(text));
            });
        } else {
            setTimeout(() => {
                resolve(parseMarkdown(text));
            }, 0);
        }
    });
};
