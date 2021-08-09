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
    id: number;
    status: 'created' | 'playing' | 'ended';
}

export type Player = {
    id: number;
    nickname: string;
    image?: string;
    turn: number;
    score: number;
}

export type Action = 'avoidEffect' | 'notAvoidEffect';
export type Order = 'skip' | 'draw' | 'wild' | 'elevenback' | 'opencard' | null;