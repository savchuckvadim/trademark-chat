import { useState } from 'react';

export const useChatInput = () => {
    const [input, setInput] = useState('');

    return {
        input,
        // setInput из useState уже стабилен, не нужно оборачивать в useCallback
        setInput,
    };
};
