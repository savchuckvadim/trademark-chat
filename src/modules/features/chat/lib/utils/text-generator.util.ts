const LOREM_WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
    'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor',
    'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna',
]

const generateChunk = () => {

    const chunk =
        LOREM_WORDS.slice(0, Math.floor(Math.random() * 10)).join(' ')
    return chunk
}


export const generateText = (targetWordsCount: number): string[] => {
    const chunks: string[] = []
    for (let i = 0; i < targetWordsCount; i++) {
        chunks.push(generateChunk())
    }
    return chunks
}
