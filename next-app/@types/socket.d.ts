import { Card } from './card'
import { Action, Order } from './game'
import { LiteralUnion } from 'type-fest';

type Event = LiteralUnion<"drawcard"| "playcard" | "call" | "chat" | "gamestart"| "gameend", string>;

export type EmitCard = {
    type: 'card';
    data: Required<Card>;
}

export type EmitAction = {
    type: 'action';
    data: Action | Order;
};

export type EmitChat = {
    type: 'chat';
    message: string;
}

export type Emit = {
    roomId: number;
    userId?: number;
    nickname?: string;
    event: Event;
    data?: EmitCard | EmitAction | EmitChat;
}

export type HandleEmitFn = (data: Emit) => void; // eslint-disable-line no-unused-vars
