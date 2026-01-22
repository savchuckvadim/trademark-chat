import { create } from 'zustand';

export interface ChatState {
    isGenerating: boolean;
}

interface ChatStore extends ChatState {
    setIsGenerating: (isGenerating: boolean) => void;
}

export const useChatStore = create<ChatStore>(set => ({
    isGenerating: false,
    setIsGenerating: isGenerating => set({ isGenerating }),
}));
