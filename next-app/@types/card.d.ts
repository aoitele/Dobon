export type Deck = {
  card: {
    suit?: 'h' | 's' | 'c' | 'd' | 'x' | 'z' | null
    num?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | null
    isOpen?: boolean
  }[]
}

export type Card = Deck['card'][0]
export type Hand = Card[]
export type HaveAllPropertyCard = Required<Card>

export type DevidedCardWithStatus = {
  open: HaveAllPropertyCard[]
  close: HaveAllPropertyCard[]
}

export type Rank = {
  0: 'JockerFree'
  1: 'Skip'
  2: '+DrawTwo'
  8: 'SelectSuit'
  11: 'ElevenBack'
  13: 'OpenCard'
}
export type RankCardNum = keyof Rank
export type RankCardText = Rank[keyof Rank]
