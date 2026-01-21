import { memo, useRef } from 'react';
import { useChatInputScroll } from '../hooks/chat-input-scroll.hook';
import { useChatInput } from '../hooks/chat-input.hook';
import { ChatInputButton } from './components/ChatInputButton';
import { useChatFormHandlers } from '../hooks/chat-form-handlers.hook';

export const ChatInput = memo(() => {
    const {
        input,
        setInput,
    } = useChatInput();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Автоматическое изменение высоты textarea
    useChatInputScroll(textareaRef, input);
    const { isGenerating, handleFormSubmit, handleKeyDown } = useChatFormHandlers();

    return (
        <form onSubmit={handleFormSubmit} className="flex gap-2 p-4 border-t">
            <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-md resize-none overflow-y-auto min-h-[40px] max-h-[200px]"
                disabled={isGenerating}
                rows={1}
            />

            <div>
                <ChatInputButton isGenerating={isGenerating} />
            </div>


        </form>
    );
});

ChatInput.displayName = 'ChatInput';
