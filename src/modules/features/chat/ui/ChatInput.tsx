import { useRef } from 'react';
import { Button } from '@components/ui/button';
import { CatIcon, SendIcon, StopCircleIcon } from 'lucide-react';
import { useChatInputScroll } from '../hooks/chat-input-scroll.hook';
import { cn } from '@/modules/shared/lib';
import { useChatInput } from '../hooks/chat-input.hook';

export const ChatInput = () => {
    const {
        input,
        setInput,
        handleSubmit,
        isSending,
        isDisabled,
        isGenerating,
        setIsGenerating
    } = useChatInput();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Автоматическое изменение высоты textarea
    useChatInputScroll(textareaRef, input);



    return (
        <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
            <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-md resize-none overflow-y-auto min-h-[40px] max-h-[200px]"
                disabled={isDisabled}
                rows={1}
            />
            <Button
                type="submit"
                disabled={isDisabled || !input.trim()}

                variant={isSending ? 'destructive' : 'default'}
            >
                <SendIcon className="w-4 h-4" />
                {isSending ? 'Sending...' : 'Send'}
            </Button>
            <div>

                <Button
                    className={cn(
                        isGenerating
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                    )}

                    onClick={() => setIsGenerating(!isGenerating)}
                    variant={isSending ? 'destructive' : 'default'}
                >
                    {isGenerating ? <StopCircleIcon className="w-4 h-4" /> : <CatIcon className="w-4 h-4" />}
                    {isGenerating ? 'Stop ' : 'Generate'}
                </Button>
            </div>


        </form>
    );
};
