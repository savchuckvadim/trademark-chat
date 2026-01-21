import { useMessageStore, type IMessageAdd } from "@/modules/entities";
import { useChatStore } from "../model/chat.store";
import { useCallback, useEffect, useRef } from "react";
import { ChatStreamService } from "../services/chat-stream.service";

export const useStreaming = () => {
    const streamingRef = useRef<ChatStreamService | null>(null)


    const addMessage = useMessageStore(state => state.addMessage);
    const setMessageStreaming = useMessageStore(state => state.setMessageStreaming);
    const updateMessage = useMessageStore(state => state.updateMessage);


    const isGenerating = useChatStore(state => state.isGenerating);
    const setIsGenerating = useChatStore(state => state.setIsGenerating);



    const startStreaming = useCallback(() => {
        if (streamingRef.current) {
            streamingRef.current.stop()
        }

        const assistantMessage: IMessageAdd = {
            role: 'assistant' as const, content: '', createdAt: new Date(), isDone: false, chunks: []
        }
        addMessage(assistantMessage)

        // Получаем ID сообщения после добавления (zustand обновляет синхронно)
        const messages = useMessageStore.getState().messages
        const lastMessage = messages[messages.length - 1]

        if (!lastMessage) {
            console.error('Failed to create message')
            return
        }

        const messageId = lastMessage.id

        try {
            streamingRef.current = new ChatStreamService({
                targetWordsCount: 10000,
                interval: 15,
                onChunk: (chunk) => {

                    updateMessage(messageId, chunk)
                    setMessageStreaming(messageId, true)
                },
                onComplete: () => {
                    setMessageStreaming(messageId, false)
                    setIsGenerating(false)
                },
                onStop: () => {
                    const currentMessages = useMessageStore.getState().messages
                    const currentLast = currentMessages.find(msg => msg.id === messageId)
                    if (currentLast) {
                        setMessageStreaming(messageId, false)
                    }
                    setIsGenerating(false)
                },
            })
        } catch (error) {
            console.error('Error creating ChatStreamService:', error)
            return
        }

        setIsGenerating(true)
        streamingRef.current.start()
    }, [addMessage, setMessageStreaming, updateMessage, setIsGenerating])

    const stopStreaming = useCallback(() => {
        if (streamingRef.current) {
            streamingRef.current.stop()
        }
        setIsGenerating(false)
    }, [setIsGenerating])

    useEffect(() => {
        return () => {
            if (streamingRef.current) {
                streamingRef.current.stop()
            }
        }
    }, [])

    return { startStreaming, stopStreaming, isGenerating }

}
