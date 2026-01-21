import { useEffect, useState, type FormEvent } from "react";
import { useMessageStore } from "@/modules/entities";
import { useChatStore } from "../model/chat.store";


export const useChatInput = () => {
    const { isLoading, addMessage } = useMessageStore(state => state);
    const { isGenerating, setIsGenerating } = useChatStore();
    const [isDisabled, setIsDisabled] = useState(false);
    const [input, setInput] = useState('');
    useEffect(() => {
        setIsDisabled(isLoading || isGenerating);
    }, [isLoading, isGenerating]);

    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setInput('');

        addMessage({
            role: 'user',
            content: input,
            createdAt: new Date(),
            isDone: true,
            chunks: [],
        });
    };
    return {
        isSending: isLoading ,

        isGenerating,

        isDisabled,
        input,
        setInput,
        addMessage,
        setIsGenerating,
        handleSubmit,
    }
}
