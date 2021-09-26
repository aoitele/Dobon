import { Event } from './socket'

export type Room = {
    id: number;
    title: string;
    status: number;
    max_seat: number;
    set_count: number;
    rate: number;
    created: Date;
    modified: Date;
}

export type Game = {
    id: number | null;
    status: 'created' | 'playing' | 'ended' | 'loading' | 'connection loss' | undefined;
    event: Event;
    board: Board;
}
export type GameStatus = Game['status']

export type Player = {
    id: number;
    nickname: string;
    image?: string;
    turn: number;
    score: number;
}

export type Board = {
    users: Player[];
    deck: string[];
    hands: string[];
    trash: string[];
}

export type Action = 'avoidEffect' | 'notAvoidEffect';
export type Order = 'skip' | 'draw' | 'wild' | 'elevenback' | 'opencard' | null;