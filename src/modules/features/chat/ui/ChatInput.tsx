import { memo, useRef } from 'react';
import { useChatInputScroll } from '../hooks/chat-input-scroll.hook';
import { useChatInput } from '../hooks/chat-input.hook';
import { ChatInputButton } from './components/ChatInputButton';
import { useChatFormHandlers } from '../hooks/chat-form-handlers.hook';
import { ChatInputText } from './components/ChatInputText';

export const ChatInput = memo(() => {
    const { input, setInput } = useChatInput();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Автоматическое изменение высоты textarea
    useChatInputScroll(textareaRef, input);
    const { isGenerating, handleFormSubmit, handleKeyDown } =
        useChatFormHandlers();

    return (
        <form onSubmit={handleFormSubmit} className="flex gap-2 p-4 border-t">
            <ChatInputText textareaRef={textareaRef} input={input} isGenerating={isGenerating} setInput={setInput} handleKeyDown={handleKeyDown} />
            <ChatInputButton isGenerating={isGenerating} />

        </form>
    );
});

ChatInput.displayName = 'ChatInput';
