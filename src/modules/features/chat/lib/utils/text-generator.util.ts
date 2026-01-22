import type { TMessageType } from '@/modules/entities';

const LOREM_WORDS = [
    'lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'sed',
    'do',
    'eiusmod',
    'tempor',
    'incididunt',
    'ut',
    'labore',
    'et',
    'dolore',
    'magna',
    'aliqua',
    'enim',
    'ad',
    'minim',
    'veniam',
    'quis',
    'nostrud',
    'exercitation',
    'ullamco',
    'laboris',
    'nisi',
];

const CODE_KEYWORDS = [
    'const',
    'let',
    'var',
    'function',
    'return',
    'if',
    'else',
    'for',
    'while',
    'class',
    'interface',
    'type',
    'async',
    'await',
    'export',
    'import',
    'from',
    'default',
    'extends',
    'implements',
];

const CODE_OPERATORS = ['=', '=>', '()', '{}', '[]', '?.', '??', '||', '&&'];

const CODE_FUNCTIONS = [
    'map',
    'filter',
    'reduce',
    'forEach',
    'find',
    'some',
    'every',
    'push',
    'pop',
    'shift',
    'unshift',
    'slice',
    'splice',
];

const CODE_TYPES = [
    'string',
    'number',
    'boolean',
    'object',
    'array',
    'null',
    'undefined',
];

const CODE_VARIABLES = [
    'data',
    'result',
    'value',
    'item',
    'element',
    'index',
    'key',
    'response',
    'request',
    'config',
    'options',
    'params',
    'args',
];

/**
 * Генерирует реалистичный код с Markdown форматированием
 * Периодически добавляет переносы строк для читаемости
 */
const generateCodeChunk = (chunkIndex: number): string => {
    const patterns = [
        // Объявление переменной
        () => {
            const keyword =
                CODE_KEYWORDS[Math.floor(Math.random() * CODE_KEYWORDS.length)];
            const variable =
                CODE_VARIABLES[
                    Math.floor(Math.random() * CODE_VARIABLES.length)
                ];
            const operator =
                CODE_OPERATORS[
                    Math.floor(Math.random() * CODE_OPERATORS.length)
                ];
            return `${keyword} ${variable} ${operator} `;
        },
        // Вызов функции
        () => {
            const func =
                CODE_FUNCTIONS[
                    Math.floor(Math.random() * CODE_FUNCTIONS.length)
                ];
            const variable =
                CODE_VARIABLES[
                    Math.floor(Math.random() * CODE_VARIABLES.length)
                ];
            return `${variable}.${func}(`;
        },
        // Тип
        () => {
            const type =
                CODE_TYPES[Math.floor(Math.random() * CODE_TYPES.length)];
            return `: ${type} `;
        },
        // Ключевое слово
        () => {
            const keyword =
                CODE_KEYWORDS[Math.floor(Math.random() * CODE_KEYWORDS.length)];
            return `${keyword} `;
        },
        // Строка с Markdown
        () => {
            const text = LOREM_WORDS.slice(
                0,
                Math.floor(Math.random() * 3) + 1,
            ).join(' ');
            return Math.random() > 0.7 ? `**${text}** ` : text + ' ';
        },
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    let chunk = pattern();

    // Добавляем перенос строки каждые 3-8 чанков для читаемости кода
    // Это предотвращает бесконечный горизонтальный скролл
    if (chunkIndex > 0) {
        const shouldBreak =
            chunkIndex % Math.floor(Math.random() * 5 + 3) === 0;
        if (shouldBreak) {
            chunk = '\n' + chunk;
        }
    }

    return chunk;
};

/**
 * Генерирует текст с Markdown форматированием
 */
const generateTextChunk = (): string => {
    const words = LOREM_WORDS.slice(0, Math.floor(Math.random() * 5) + 1).join(
        ' ',
    );

    // Иногда добавляем bold
    if (Math.random() > 0.85) {
        return `**${words}** `;
    }

    // Иногда добавляем inline code
    if (Math.random() > 0.9) {
        const codeWord =
            CODE_KEYWORDS[Math.floor(Math.random() * CODE_KEYWORDS.length)];
        return `${words} \`${codeWord}\` `;
    }

    return words + ' ';
};

export const generateChunk = (
    type: TMessageType,
    chunkIndex: number = 0,
): string => {
    if (type === 'code') {
        return generateCodeChunk(chunkIndex);
    }
    return generateTextChunk();
};

/**
 * Генерирует массив чанков текста
 */
export const generateText = (
    targetWordsCount: number,
    type: TMessageType,
): string[] => {
    const chunks: string[] = [];
    let chunkIndex = 0;

    // Для code типа иногда добавляем code blocks
    if (type === 'code' && Math.random() > 0.7) {
        const codeBlock = CODE_KEYWORDS.slice(
            0,
            Math.floor(Math.random() * 5) + 3,
        ).join(' ');
        chunks.push(`\`\`\`typescript\n${codeBlock}\n\`\`\`\n`);
        chunkIndex++;
    }

    for (let i = 0; i < targetWordsCount; i++) {
        chunks.push(generateChunk(type, chunkIndex));
        chunkIndex++;

        // Периодически добавляем code blocks в текстовые сообщения
        if (type === 'text' && i > 0 && i % 100 === 0 && Math.random() > 0.8) {
            const codeBlock = CODE_KEYWORDS.slice(
                0,
                Math.floor(Math.random() * 3) + 2,
            ).join(' ');
            chunks.push(`\`\`\`typescript\n${codeBlock}\n\`\`\`\n`);
            chunkIndex++;
        }
    }

    return chunks;
};
