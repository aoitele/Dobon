import { HandCards } from '../../@types/card'
import { OtherHands } from '../../@types/game'
import { resRiskCard } from '../../utils/game/cpu/thinking/putout/resRiskCard'

const DOBON_ABLE_HANDS: string[] | HandCards[] = ['h6', 'h2']
const DOBON_ABLE_HANDS_HALF_OPEN: string[] | HandCards[] = ['h6o', 'h2']
const DOBON_ABLE_HANDS_FULL_OPEN: string[] | HandCards[] = ['h6o', 'h2o'] // expected [4, 8]
const DOBON_ABLE_HANDS_FULL_OPEN_PAT_2: string[] | HandCards[] = ['h1o', 'h5o'] // expected [4, 6]

const DOBON_ABLE_HANDS_SUIT_S: string[] | HandCards[] = ['s6', 's2']
const DOBON_ABLE_HANDS_ONE_JOKER: string[] | HandCards[] = ['x1o']
const DOBON_ABLE_HANDS_JOKER_CARD_NUMBER: string[] | HandCards[] = ['d9o', 'h12o'] // expected [0, 3]

const DOBON_DISABLE_HANDS: string[] | HandCards[] = ['s9', 's3', 's4']
const DOBON_DISABLE_HANDS_FULL_OPEN: string[] | HandCards[] = ['s9o', 's3o', 's4o']

const OTHER_HANDS_NO_OPENER: OtherHands[] = [
  { userId: 0, hands: DOBON_ABLE_HANDS, nickname: 'me' },
  { userId: 0, hands: DOBON_ABLE_HANDS_SUIT_S, nickname: 'com2' },
  { userId: 0, hands: DOBON_DISABLE_HANDS, nickname: 'com3' }
]

const OTHER_HANDS_EXIST_HALF_OPENER: OtherHands[] = [
  { userId: 0, hands: DOBON_ABLE_HANDS_HALF_OPEN, nickname: 'me' },
  { userId: 0, hands: DOBON_ABLE_HANDS_SUIT_S, nickname: 'com2' },
  { userId: 0, hands: DOBON_DISABLE_HANDS, nickname: 'com3' }
]

const OTHER_HANDS_EXIST_FULL_OPENER_DISABLE_DOBON: OtherHands[] = [
  { userId: 0, hands: DOBON_DISABLE_HANDS_FULL_OPEN, nickname: 'me' },
  { userId: 0, hands: DOBON_ABLE_HANDS_SUIT_S, nickname: 'com2' },
  { userId: 0, hands: DOBON_DISABLE_HANDS, nickname: 'com3' }
]

const OTHER_HANDS_EXIST_FULL_OPENER_DOBON: OtherHands[] = [
  { userId: 0, hands: DOBON_ABLE_HANDS_FULL_OPEN, nickname: 'me' },
  { userId: 0, hands: DOBON_ABLE_HANDS_SUIT_S, nickname: 'com2' },
  { userId: 0, hands: DOBON_DISABLE_HANDS, nickname: 'com3' }
]

const OTHER_HANDS_EXIST_FULL_OPENER_DOBON_TWO_USERS: OtherHands[] = [
  { userId: 0, hands: DOBON_ABLE_HANDS_FULL_OPEN, nickname: 'me' },
  { userId: 0, hands: DOBON_ABLE_HANDS_FULL_OPEN_PAT_2, nickname: 'com2' },
  { userId: 0, hands: DOBON_DISABLE_HANDS, nickname: 'com3' }
]

const OTHER_HANDS_EXIST_FULL_OPENER_DOBON_JOKER: OtherHands[] = [
  { userId: 0, hands: DOBON_ABLE_HANDS_ONE_JOKER, nickname: 'me' },
  { userId: 0, hands: DOBON_ABLE_HANDS_SUIT_S, nickname: 'com2' },
  { userId: 0, hands: DOBON_DISABLE_HANDS, nickname: 'com3' }
]

const OTHER_HANDS_EXIST_FULL_OPENER_DOBON_JOKER_SUM21: OtherHands[] = [
  { userId: 0, hands: DOBON_ABLE_HANDS_JOKER_CARD_NUMBER, nickname: 'me' },
  { userId: 0, hands: DOBON_ABLE_HANDS_SUIT_S, nickname: 'com2' },
  { userId: 0, hands: DOBON_DISABLE_HANDS, nickname: 'com3' }
]

const sample_1 = [
  { userId: 0, hands: [ 'd6', 'h2' ], nickname: 'me' },
  { userId: 0, hands: [ 'd1' ], nickname: 'com1' },
  { userId: 0, hands: [ 'd9o', 'h12o' ], nickname: 'com3' }
] 
/** 
 * Test Cases For resRiskCard Func
 *
 * - There is no user having full open hands -> safety
 * - There is one user having half open hands -> safety
 * - There is one user having full open hands
 *   -> canDobon?
 *      -> y/get risk cards (ex. [4, 6])
 *      -> n/safety
 * - There is two user having full open hands
 *   -> canDobon?
 *      -> one y/get risk cards (ex. [4, 6])
 *      -> two y/get risk cards (ex. [4, 6, 11]) ※number should be unique
 * - hand include only one Joker -> expected [0]
 */

describe.each`
otherHands                                         | expected
${OTHER_HANDS_NO_OPENER}                           | ${[]}
${OTHER_HANDS_EXIST_HALF_OPENER}                   | ${[]}
${OTHER_HANDS_EXIST_FULL_OPENER_DISABLE_DOBON}     | ${[]}
${OTHER_HANDS_EXIST_FULL_OPENER_DOBON}             | ${[4, 8]}
${OTHER_HANDS_EXIST_FULL_OPENER_DOBON_TWO_USERS}   | ${[4, 6, 8]}
${OTHER_HANDS_EXIST_FULL_OPENER_DOBON_JOKER}       | ${[0]} // jokerは数字0として扱う
${OTHER_HANDS_EXIST_FULL_OPENER_DOBON_JOKER_SUM21} | ${[0, 3]}
`('resRiskCard TestCases -> ドボンできる手札を持つユーザーが手札フル公開状態であればリスクカードとする', ({ otherHands, expected }) => {
  test(`${JSON.stringify(otherHands)} returns ${expected}`, () => {
    let result = resRiskCard(otherHands)

    expect(Array.isArray(expected)).toBe(true)
    expect(expected.length).toBe(result.length)
    result.forEach(number => expect(expected).toContain(number))
  })
})

