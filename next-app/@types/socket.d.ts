import { Card } from './card'
import { Action, Order } from './game'
import { LiteralUnion } from 'type-fest';

type Event = LiteralUnion<"drawcard"| "playcard" | "call" | "chat", string>;
type EmitAction = Action | Order;

type Chat = {
    message: string;
}

export type Emit = {
    roomId: number;
    userId: number;
    nickname: string;
    event: Event;
    data?: Required<Card> | EmitAction | Chat;
}

export type HandleEmitFn = (data: Emit) => void; // eslint-disable-line no-unused-vars


