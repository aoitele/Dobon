import { LiteralUnion } from 'type-fest'

export type Deck = {
  card: {
    suit?: 'h' | 's' | 'c' | 'd' | 'x' | 'z' | null
    num?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | null
    isOpen?: boolean
    isPutable?: boolean
  }[]
}

export type Card = Deck['card'][0]
export type Hand = Card[]
export type HaveAllPropertyCard = Required<Card>

// 正規表現で柄と数字を取得する場合のみ使用、stringで弾かれるため
export type AllowCardStringType = {
  suit: LiteralUnion<'h' | 's' | 'c' | 'd' | 'x' | 'z' | string> | null
  num: LiteralUnion<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | string> | null
  isOpen: boolean
  isPutable: boolean
}

// h1(裏向き), h1o(オープン状態)
export type HandCards =
'h1' | 'h2' |  'h3' | 'h4' |'h5' | 'h6' |'h7' | 'h8' |'h9' | 'h10' |'h11' | 'h12' |'h13' |
's1' | 's2' |  's3' | 's4' |'s5' | 's6' |'s7' | 's8' |'s9' | 's10' |'s11' | 's12' |'s13' |
'c1' | 'c2' |  'c3' | 'c4' |'c5' | 'c6' |'c7' | 'c8' |'c9' | 'c10' |'c11' | 'c12' |'c13' |
'd1' | 'd2' |  'd3' | 'd4' |'d5' | 'd6' |'d7' | 'd8' |'d9' | 'd10' |'d11' | 'd12' |'d13' |
'h1o' | 'h2o' |  'h3o' | 'h4o' |'h5o' | 'h6o' |'h7o' | 'h8o' |'h9o' | 'h10o' |'h11o' | 'h12o' |'h13o' |
's1o' | 's2o' |  's3o' | 's4o' |'s5o' | 's6o' |'s7o' | 's8o' |'s9o' | 's10o' |'s11o' | 's12o' |'s13o' |
'c1o' | 'c2o' |  'c3o' | 'c4o' |'c5o' | 'c6o' |'c7o' | 'c8o' |'c9o' | 'c10o' |'c11o' | 'c12o' |'c13o' |
'd1o' | 'd2o' |  'd3o' | 'd4o' |'d5o' | 'd6o' |'d7o' | 'd8o' |'d9o' | 'd10o' |'d11o' | 'd12o' |'d13o' |
'x0' |'x0o' | 'x1' |'x1o' |'z' | 'zo'

export type DevidedCardWithStatus = {
  open: HaveAllPropertyCard[]
  close: HaveAllPropertyCard[]
}

export type Rank = {
  0: 'ジョーカー(ワイルド、21でドボン可能)',
  1: 'スキップ',
  2: 'ドローカード+2',
  8: 'ワイルド',
  11: 'リバース',
  13: '手札公開'
}
export type RankCardNum = keyof Rank
export type RankCardText = Rank[keyof Rank]
