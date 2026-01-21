import { useState, useRef, type FormEvent } from 'react';
import { Button } from '@components/ui/button';
import { SendIcon } from 'lucide-react';
import { useMessageStore } from '@/modules/entities';
import { useChatInputScroll } from '../hooks/chat-input-scroll.hook';

export const ChatInput = () => {
    const [input, setInput] = useState('');
    const [disabled] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const addMessage = useMessageStore(state => state.addMessage);
    // Автоматическое изменение высоты textarea
    useChatInputScroll(textareaRef, input);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setInput('');
        debugger;
        addMessage({
            role: 'user',
            content: input,
            createdAt: new Date(),
            isDone: true,
            chunks: [],
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
            <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-md resize-none overflow-y-auto min-h-[40px] max-h-[200px]"
                disabled={disabled}
                rows={1}
            />
            <Button
                type="submit"
                disabled={disabled || !input.trim()}
                onClick={() => setIsSending(!isSending)}
                variant={isSending ? 'destructive' : 'default'}
            >
                <SendIcon className="w-4 h-4" />
                {isSending ? 'Sending...' : 'Send'}
            </Button>
        </form>
    );
};
