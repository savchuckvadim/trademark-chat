import { Button } from '@/modules/shared/components/ui/button';
import { cn } from '@/modules/shared/lib';
import { CatIcon, StopCircleIcon } from 'lucide-react';
import { memo, type FC } from 'react';

export interface ChatInputButtonProps {
    isGenerating: boolean;
}

export const ChatInputButton: FC<ChatInputButtonProps> = memo(
    ({ isGenerating }) => {
        return (
            <Button
                type="submit"
                className={cn(
                    isGenerating
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600',
                )}
                variant={isGenerating ? 'destructive' : 'default'}
            >
                {isGenerating ? (
                    <StopCircleIcon className="w-4 h-4" />
                ) : (
                    <CatIcon className="w-4 h-4" />
                )}
                {isGenerating ? 'Stop ' : 'Generate'}
            </Button>
        );
    },
    (prevProps, nextProps) => {
        return prevProps.isGenerating === nextProps.isGenerating;
    },
);

ChatInputButton.displayName = 'ChatInputButton';
