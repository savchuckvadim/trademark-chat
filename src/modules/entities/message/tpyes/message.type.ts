export type TMessageRole = 'user' | 'assistant';

export interface IMessage {
    id: string;
    role: TMessageRole;
    content: string;
    createdAt: Date;
    isDone: boolean;
    chunks: string[];
}
