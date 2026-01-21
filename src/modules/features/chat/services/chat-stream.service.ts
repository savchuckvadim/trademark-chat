import { generateText } from "../lib/utils/text-generator.util"


export interface IChatStreamServiceConfig {
    targetWordsCount?: number
    interval: number
    onChunk: (chunk: string) => void
    // onStart: () => void
    onStop: () => void
    onComplete: () => void
}

export class ChatStreamService {

    private config: IChatStreamServiceConfig
    private intervalId: number | null = null
    private currentIndex: number = 0
    private chunks: string[] = []
    constructor(config: IChatStreamServiceConfig) {
        this.config = config
        this.chunks = generateText(config.targetWordsCount || 1000)
    }

    public start() {
        if (this.intervalId !== null) return

        this.intervalId = window.setInterval(() => {
            if (this.currentIndex >= this.chunks.length) {
                this.stop()
                this.config.onComplete()
                return
            }

            const chunk = this.chunks[this.currentIndex]
            this.config.onChunk(chunk)
            this.currentIndex++
        }, this.config.interval)

    }


    public stop(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
        this.config.onStop?.()
    }

    public reset(): void {
        this.stop()
        this.currentIndex = 0
    }
}
