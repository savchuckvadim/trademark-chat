import { memo, type FC } from "react";

export interface IChatInputTextProps {

    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    input: string;
    setInput: (input: string) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    isGenerating: boolean;
}
export const ChatInputText: FC<IChatInputTextProps> = memo(({
    textareaRef, input, isGenerating,
    setInput, handleKeyDown

}) => {
    return <textarea
        ref={textareaRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 border rounded-md resize-none overflow-y-auto min-h-[40px] max-h-[200px]"
        disabled={isGenerating}
        rows={1}
    />
});

ChatInputText.displayName = 'ChatInputText';
