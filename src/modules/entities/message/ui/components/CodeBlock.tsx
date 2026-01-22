import { memo } from 'react';
import { cn } from '@lib';

interface CodeBlockProps {
    code: string;
    className?: string;
}

export const CodeBlock = memo(
    ({ code, className }: CodeBlockProps) => {
        return (
            <pre
                className={cn(
                    'bg-[#1e1e1e] dark:bg-[#1e1e1e] p-4 rounded-lg my-2',
                    'font-mono text-sm text-[#d4d4d4]',
                    'overflow-x-auto overflow-y-hidden',
                    'break-words whitespace-pre-wrap',
                    'border border-[#3e3e3e]',
                    className,
                )}
            >
                <code className="whitespace-pre-wrap break-words word-break-break-all">
                    {code}
                </code>
            </pre>
        );
    },
    (prevProps, nextProps) => {
        return prevProps.code === nextProps.code;
    },
);

CodeBlock.displayName = 'CodeBlock';
