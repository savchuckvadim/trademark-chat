export type TMessageRole = 'user' | 'assistant';
export type TMessageType = 'text' | 'code';
export interface IMessage {
    id: string;
    role: TMessageRole;
    content: string;
    createdAt: Date;
    isDone: boolean;
    chunks: string[];
    type: TMessageType;
}

export interface IMessageAdd extends Omit<IMessage, 'id' | 'timestamp'> {}
