export type Deck = {
	card: {
		suit?: 'h' | 's' | 'c' | 'd' | 'x' | 'z' | null;
		num?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | null;
		isOpen?: boolean;
	}[]
};

export type Card = Deck["card"][0]
export type Hand = Card[];
export type HaveAllPropertyCard = Required<Card>

export type DevidedCardWithStatus = {
    open: HaveAllPropertyCard[];
    close: HaveAllPropertyCard[];
}

export type Rank = {
	0: 'Jocker Free';
	2: 'add Draw Two';
	8: 'Choice Suit';
	11: 'Eleven Back';
	13: 'Open Card';
}
export type RankCard = keyof Rank;
