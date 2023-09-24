import { Player } from '../../@types/game'
import { culcGetScore } from '../../utils/game/score'
import { PLAYERS_FOR_PVE, setWinner } from '../__mocks__/data/player'

const dobonNum_0 = 0 // jokerどぼんのテスト用
const dobonNum_1 = 1
const dobonNum_8 = 8

const bonusCards_1 = [2]
const bonusCards_2 = [2, 4]
const bonusCards_2_with_joker = [0, 3]
const bonusCards_3 = [2, 11, 4]
const bonusCards_3_with_joker = [2, 0, 3]
const bonusCards_3_with_joker_double = [0, 0, 3]
const bonusCards_4 = [2, 11, 12, 2]
const bonusCards_4_with_joker = [2, 0, 11, 6]
const bonusCards_4_with_joker_double = [2, 0, 0, 6]
const bonusCards_10 = [2, 11, 11, 11, 12, 12, 12, 13, 13, 13]
const bonusCards_10_with_joker = [2, 11, 11, 0, 12, 12, 12, 13, 13, 13]
const bonusCards_10_with_joker_double = [2, 11, 11, 0, 12, 12, 0, 13, 13, 13]

const playersMock_1_winner_1_loser = setWinner({ winnerTurns:[1], loserTurns:[4] }) // （通常のドボン or ドボン返し）
// const playersMock_2_winner_1_loser = setWinner({ winnerTurns:[1, 2], loserTurns:[4] }) // （誰かが出したカードで同時ドボンが発生した場合）
const playersMock_1_winner_2_loser = setWinner({ winnerTurns:[1], loserTurns:[3, 4] }) // （同時ドボンがドボン返しされた場合）
const playersMock_1_winner_3_loser = setWinner({ winnerTurns:[1], loserTurns:[2, 3, 4] }) // （ゲーム開始時に天和ドボンした場合）
const playersMock_2_winner_2_loser = setWinner({ winnerTurns:[1, 2, 3], loserTurns:[4] }) // （天和ドボンが複数名で発生した場合）
const playersMock_4_winner_0_loser = setWinner({ winnerTurns:[1, 2, 3, 4], loserTurns:[] }) // （天和ドボンが全員で発生した場合）

describe('Score TestCases - 通常どぼんパターン', () => {
  describe.each`
    dobonNum    |   bonusCards     | isReverseDobon | expected
  ${dobonNum_0} | ${bonusCards_1}  |    ${false}    | ${42}
  ${dobonNum_0} | ${bonusCards_2}  |    ${false}    | ${126}
  ${dobonNum_0} | ${bonusCards_3}  |    ${false}    | ${336}
  ${dobonNum_0} | ${bonusCards_4}  |    ${false}    | ${504}
  ${dobonNum_0} | ${bonusCards_10} |    ${false}    | ${1932}
  ${dobonNum_0} | ${bonusCards_1}  |    ${true}     | ${84}
  ${dobonNum_0} | ${bonusCards_2}  |    ${true}     | ${252}
  ${dobonNum_0} | ${bonusCards_3}  |    ${true}     | ${672}
  ${dobonNum_0} | ${bonusCards_4}  |    ${true}     | ${1008}
  ${dobonNum_0} | ${bonusCards_10} |    ${true}     | ${3864}
  ${dobonNum_1} | ${bonusCards_1}  |    ${false}    | ${2}
  ${dobonNum_1} | ${bonusCards_2}  |    ${false}    | ${6}
  ${dobonNum_1} | ${bonusCards_3}  |    ${false}    | ${16}
  ${dobonNum_1} | ${bonusCards_4}  |    ${false}    | ${24}
  ${dobonNum_1} | ${bonusCards_10} |    ${false}    | ${92}
  ${dobonNum_1} | ${bonusCards_1}  |    ${true}     | ${4}
  ${dobonNum_1} | ${bonusCards_2}  |    ${true}     | ${12}
  ${dobonNum_1} | ${bonusCards_3}  |    ${true}     | ${32}
  ${dobonNum_1} | ${bonusCards_4}  |    ${true}     | ${48}
  ${dobonNum_1} | ${bonusCards_10} |    ${true}     | ${184}
  ${dobonNum_8} | ${bonusCards_1}  |    ${false}    | ${16}
  ${dobonNum_8} | ${bonusCards_2}  |    ${false}    | ${48}
  ${dobonNum_8} | ${bonusCards_3}  |    ${false}    | ${128}
  ${dobonNum_8} | ${bonusCards_4}  |    ${false}    | ${192}
  ${dobonNum_8} | ${bonusCards_10} |    ${false}    | ${736}
  ${dobonNum_8} | ${bonusCards_1}  |    ${true}     | ${32}
  ${dobonNum_8} | ${bonusCards_2}  |    ${true}     | ${96}
  ${dobonNum_8} | ${bonusCards_3}  |    ${true}     | ${256}
  ${dobonNum_8} | ${bonusCards_4}  |    ${true}     | ${384}
  ${dobonNum_8} | ${bonusCards_10} |    ${true}     | ${1472}
  `('$card should be', ({ dobonNum, bonusCards, isReverseDobon, expected }) => {
    test(`returns ${expected}`, () => {
      let result = culcGetScore({ dobonNum, bonusCards, isReverseDobon, winner:playersMock_1_winner_1_loser.winner, loser: playersMock_1_winner_1_loser.loser })
      expect(result).toBe(expected)
    })
  })
})

describe('Score TestCases - 単騎どぼんパターン', () => {
  describe.each`
    dobonNum    |   bonusCards                       | isReverseDobon | expected
  ${dobonNum_0} | ${bonusCards_1}                    |    ${false}    | ${84}
  ${dobonNum_0} | ${bonusCards_1}                    |    ${true}     | ${168}
  ${dobonNum_1} | ${bonusCards_1}                    |    ${false}    | ${4}
  ${dobonNum_1} | ${bonusCards_1}                    |    ${true}     | ${8}
  ${dobonNum_8} | ${bonusCards_1}                    |    ${false}    | ${32}
  ${dobonNum_8} | ${bonusCards_1}                    |    ${true}     | ${64}
  ${dobonNum_0} | ${bonusCards_2_with_joker}         |    ${false}    | ${252}
  ${dobonNum_0} | ${bonusCards_3_with_joker_double}  |    ${false}    | ${504}
  `('$card should be', ({ dobonNum, bonusCards, isReverseDobon, expected }) => {
    test(`returns ${expected}`, () => {
      let result = culcGetScore({ dobonNum, bonusCards, isReverseDobon, isSingleDobon:true, winner:playersMock_1_winner_1_loser.winner, loser: playersMock_1_winner_1_loser.loser })
      expect(result).toBe(expected)
    })
  })
})

describe('Score TestCases - bonusCardにjokerが1枚ある場合', () => {
  describe.each`
    dobonNum    |   bonusCards                | isReverseDobon | expected
  ${dobonNum_0} | ${bonusCards_2_with_joker}  |    ${false}    | ${126}
  ${dobonNum_0} | ${bonusCards_3_with_joker}  |    ${false}    | ${210}
  ${dobonNum_0} | ${bonusCards_4_with_joker}  |    ${false}    | ${756}
  ${dobonNum_0} | ${bonusCards_10_with_joker} |    ${false}    | ${3444}
  ${dobonNum_0} | ${bonusCards_2_with_joker}  |    ${true}     | ${252}
  ${dobonNum_0} | ${bonusCards_3_with_joker}  |    ${true}     | ${420}
  ${dobonNum_0} | ${bonusCards_4_with_joker}  |    ${true}     | ${1512}
  ${dobonNum_0} | ${bonusCards_10_with_joker} |    ${true}     | ${6888}
  ${dobonNum_1} | ${bonusCards_2_with_joker}  |    ${false}    | ${6}
  ${dobonNum_1} | ${bonusCards_3_with_joker}  |    ${false}    | ${10}
  ${dobonNum_1} | ${bonusCards_4_with_joker}  |    ${false}    | ${36}
  ${dobonNum_1} | ${bonusCards_10_with_joker} |    ${false}    | ${164}
  ${dobonNum_1} | ${bonusCards_2_with_joker}  |    ${true}     | ${12}
  ${dobonNum_1} | ${bonusCards_3_with_joker}  |    ${true}     | ${20}
  ${dobonNum_1} | ${bonusCards_4_with_joker}  |    ${true}     | ${72}
  ${dobonNum_1} | ${bonusCards_10_with_joker} |    ${true}     | ${328}
  ${dobonNum_8} | ${bonusCards_2_with_joker}  |    ${false}    | ${48}
  ${dobonNum_8} | ${bonusCards_3_with_joker}  |    ${false}    | ${80}
  ${dobonNum_8} | ${bonusCards_4_with_joker}  |    ${false}    | ${288}
  ${dobonNum_8} | ${bonusCards_10_with_joker} |    ${false}    | ${1312}
  ${dobonNum_8} | ${bonusCards_2_with_joker}  |    ${true}     | ${96}
  ${dobonNum_8} | ${bonusCards_3_with_joker}  |    ${true}     | ${160}
  ${dobonNum_8} | ${bonusCards_4_with_joker}  |    ${true}     | ${576}
  ${dobonNum_8} | ${bonusCards_10_with_joker} |    ${true}     | ${2624}
  `('$card should be', ({ dobonNum, bonusCards, isReverseDobon, expected }) => {
    test(`returns ${expected}`, () => {
      let result = culcGetScore({ dobonNum, bonusCards, isReverseDobon, winner:playersMock_1_winner_1_loser.winner, loser: playersMock_1_winner_1_loser.loser })
      expect(result).toBe(expected)
    })
  })
})

describe('Score TestCases - bonusCardにjokerが2枚ある場合', () => {
  describe.each`
    dobonNum    |   bonusCards                       | isReverseDobon | expected
  ${dobonNum_0} | ${bonusCards_3_with_joker_double}  |    ${false}    | ${252}
  ${dobonNum_0} | ${bonusCards_4_with_joker_double}  |    ${false}    | ${672}
  ${dobonNum_0} | ${bonusCards_10_with_joker_double} |    ${false}    | ${6048}
  ${dobonNum_0} | ${bonusCards_3_with_joker_double}  |    ${true}     | ${504}
  ${dobonNum_0} | ${bonusCards_4_with_joker_double}  |    ${true}     | ${1344}
  ${dobonNum_0} | ${bonusCards_10_with_joker_double} |    ${true}     | ${12096}
  ${dobonNum_1} | ${bonusCards_3_with_joker_double}  |    ${false}    | ${12}
  ${dobonNum_1} | ${bonusCards_4_with_joker_double}  |    ${false}    | ${32}
  ${dobonNum_1} | ${bonusCards_10_with_joker_double} |    ${false}    | ${288}
  ${dobonNum_1} | ${bonusCards_3_with_joker_double}  |    ${true}     | ${24}
  ${dobonNum_1} | ${bonusCards_4_with_joker_double}  |    ${true}     | ${64}
  ${dobonNum_1} | ${bonusCards_10_with_joker_double} |    ${true}     | ${576}
  ${dobonNum_8} | ${bonusCards_3_with_joker_double}  |    ${false}    | ${96}
  ${dobonNum_8} | ${bonusCards_4_with_joker_double}  |    ${false}    | ${256}
  ${dobonNum_8} | ${bonusCards_10_with_joker_double} |    ${false}    | ${2304}
  ${dobonNum_8} | ${bonusCards_3_with_joker_double}  |    ${true}     | ${192}
  ${dobonNum_8} | ${bonusCards_4_with_joker_double}  |    ${true}     | ${512}
  ${dobonNum_8} | ${bonusCards_10_with_joker_double} |    ${true}     | ${4608}
  `('$card should be', ({ dobonNum, bonusCards, isReverseDobon, expected }) => {
    test(`returns ${expected}`, () => {
      let result = culcGetScore({ dobonNum, bonusCards, isReverseDobon, winner:playersMock_1_winner_1_loser.winner, loser: playersMock_1_winner_1_loser.loser })
      expect(result).toBe(expected)
    })
  })
})

describe('Score TestCases - 同時ドボンがドボン返しされた場合、2人からスコアを得る', () => {
  describe.each`
    dobonNum    |   bonusCards     | isReverseDobon | expected
  ${dobonNum_0} | ${bonusCards_1}  |    ${false}    | ${42 * 2}
  ${dobonNum_0} | ${bonusCards_2}  |    ${false}    | ${126 * 2}
  ${dobonNum_0} | ${bonusCards_3}  |    ${false}    | ${336 * 2}
  ${dobonNum_0} | ${bonusCards_4}  |    ${false}    | ${504 * 2}
  ${dobonNum_0} | ${bonusCards_10} |    ${false}    | ${1932 * 2}
  ${dobonNum_0} | ${bonusCards_1}  |    ${true}     | ${84 * 2}
  ${dobonNum_0} | ${bonusCards_2}  |    ${true}     | ${252 * 2}
  ${dobonNum_0} | ${bonusCards_3}  |    ${true}     | ${672 * 2}
  ${dobonNum_0} | ${bonusCards_4}  |    ${true}     | ${1008 * 2}
  ${dobonNum_0} | ${bonusCards_10} |    ${true}     | ${3864 * 2}
  ${dobonNum_1} | ${bonusCards_1}  |    ${false}    | ${2 * 2}
  ${dobonNum_1} | ${bonusCards_2}  |    ${false}    | ${6 * 2}
  ${dobonNum_1} | ${bonusCards_3}  |    ${false}    | ${16 * 2}
  ${dobonNum_1} | ${bonusCards_4}  |    ${false}    | ${24 * 2}
  ${dobonNum_1} | ${bonusCards_10} |    ${false}    | ${92 * 2}
  ${dobonNum_1} | ${bonusCards_1}  |    ${true}     | ${4 * 2}
  ${dobonNum_1} | ${bonusCards_2}  |    ${true}     | ${12 * 2}
  ${dobonNum_1} | ${bonusCards_3}  |    ${true}     | ${32 * 2}
  ${dobonNum_1} | ${bonusCards_4}  |    ${true}     | ${48 * 2}
  ${dobonNum_1} | ${bonusCards_10} |    ${true}     | ${184 * 2}
  ${dobonNum_8} | ${bonusCards_1}  |    ${false}    | ${16 * 2}
  ${dobonNum_8} | ${bonusCards_2}  |    ${false}    | ${48 * 2}
  ${dobonNum_8} | ${bonusCards_3}  |    ${false}    | ${128 * 2}
  ${dobonNum_8} | ${bonusCards_4}  |    ${false}    | ${192 * 2}
  ${dobonNum_8} | ${bonusCards_10} |    ${false}    | ${736 * 2}
  ${dobonNum_8} | ${bonusCards_1}  |    ${true}     | ${32 * 2}
  ${dobonNum_8} | ${bonusCards_2}  |    ${true}     | ${96 * 2}
  ${dobonNum_8} | ${bonusCards_3}  |    ${true}     | ${256 * 2}
  ${dobonNum_8} | ${bonusCards_4}  |    ${true}     | ${384 * 2}
  ${dobonNum_8} | ${bonusCards_10} |    ${true}     | ${1472 * 2}
  `('$card should be', ({ dobonNum, bonusCards, isReverseDobon, expected }) => {
    test(`returns ${expected}`, () => {
      let result = culcGetScore({ dobonNum, bonusCards, isReverseDobon, winner:playersMock_1_winner_2_loser.winner, loser: playersMock_1_winner_2_loser.loser })
      expect(result).toBe(expected)
    })
  })
})

describe('Score TestCases - ゲーム開始時に天和ドボンした場合、3人からスコアを得る', () => {
  describe.each`
    dobonNum    |   bonusCards     | isReverseDobon | expected
  ${dobonNum_0} | ${bonusCards_1}  |    ${false}    | ${42 * 3}
  ${dobonNum_0} | ${bonusCards_2}  |    ${false}    | ${126 * 3}
  ${dobonNum_0} | ${bonusCards_3}  |    ${false}    | ${336 * 3}
  ${dobonNum_0} | ${bonusCards_4}  |    ${false}    | ${504 * 3}
  ${dobonNum_0} | ${bonusCards_10} |    ${false}    | ${1932 * 3}
  ${dobonNum_0} | ${bonusCards_1}  |    ${true}     | ${84 * 3}
  ${dobonNum_0} | ${bonusCards_2}  |    ${true}     | ${252 * 3}
  ${dobonNum_0} | ${bonusCards_3}  |    ${true}     | ${672 * 3}
  ${dobonNum_0} | ${bonusCards_4}  |    ${true}     | ${1008 * 3}
  ${dobonNum_0} | ${bonusCards_10} |    ${true}     | ${3864 * 3}
  ${dobonNum_1} | ${bonusCards_1}  |    ${false}    | ${2 * 3}
  ${dobonNum_1} | ${bonusCards_2}  |    ${false}    | ${6 * 3}
  ${dobonNum_1} | ${bonusCards_3}  |    ${false}    | ${16 * 3}
  ${dobonNum_1} | ${bonusCards_4}  |    ${false}    | ${24 * 3}
  ${dobonNum_1} | ${bonusCards_10} |    ${false}    | ${92 * 3}
  ${dobonNum_1} | ${bonusCards_1}  |    ${true}     | ${4 * 3}
  ${dobonNum_1} | ${bonusCards_2}  |    ${true}     | ${12 * 3}
  ${dobonNum_1} | ${bonusCards_3}  |    ${true}     | ${32 * 3}
  ${dobonNum_1} | ${bonusCards_4}  |    ${true}     | ${48 * 3}
  ${dobonNum_1} | ${bonusCards_10} |    ${true}     | ${184 * 3}
  ${dobonNum_8} | ${bonusCards_1}  |    ${false}    | ${16 * 3}
  ${dobonNum_8} | ${bonusCards_2}  |    ${false}    | ${48 * 3}
  ${dobonNum_8} | ${bonusCards_3}  |    ${false}    | ${128 * 3}
  ${dobonNum_8} | ${bonusCards_4}  |    ${false}    | ${192 * 3}
  ${dobonNum_8} | ${bonusCards_10} |    ${false}    | ${736 * 3}
  ${dobonNum_8} | ${bonusCards_1}  |    ${true}     | ${32 * 3}
  ${dobonNum_8} | ${bonusCards_2}  |    ${true}     | ${96 * 3}
  ${dobonNum_8} | ${bonusCards_3}  |    ${true}     | ${256 * 3}
  ${dobonNum_8} | ${bonusCards_4}  |    ${true}     | ${384 * 3}
  ${dobonNum_8} | ${bonusCards_10} |    ${true}     | ${1472 * 3}
  `('$card should be', ({ dobonNum, bonusCards, isReverseDobon, expected }) => {
    test(`returns ${expected}`, () => {
      let result = culcGetScore({ dobonNum, bonusCards, isReverseDobon, winner:playersMock_1_winner_3_loser.winner, loser: playersMock_1_winner_3_loser.loser })
      expect(result).toBe(expected)
    })
  })
})

describe('Score TestCases - 天和ドボンが複数名で発生した場合、3人からスコアを得る', () => {
  describe.each`
    dobonNum    |   bonusCards     | isReverseDobon | expected
  ${dobonNum_0} | ${bonusCards_1}  |    ${false}    | ${42}
  ${dobonNum_0} | ${bonusCards_2}  |    ${false}    | ${126}
  ${dobonNum_0} | ${bonusCards_3}  |    ${false}    | ${336}
  ${dobonNum_0} | ${bonusCards_4}  |    ${false}    | ${504}
  ${dobonNum_0} | ${bonusCards_10} |    ${false}    | ${1932}
  ${dobonNum_0} | ${bonusCards_1}  |    ${true}     | ${84}
  ${dobonNum_0} | ${bonusCards_2}  |    ${true}     | ${252}
  ${dobonNum_0} | ${bonusCards_3}  |    ${true}     | ${672}
  ${dobonNum_0} | ${bonusCards_4}  |    ${true}     | ${1008}
  ${dobonNum_0} | ${bonusCards_10} |    ${true}     | ${3864}
  ${dobonNum_1} | ${bonusCards_1}  |    ${false}    | ${2}
  ${dobonNum_1} | ${bonusCards_2}  |    ${false}    | ${6}
  ${dobonNum_1} | ${bonusCards_3}  |    ${false}    | ${16}
  ${dobonNum_1} | ${bonusCards_4}  |    ${false}    | ${24}
  ${dobonNum_1} | ${bonusCards_10} |    ${false}    | ${92}
  ${dobonNum_1} | ${bonusCards_1}  |    ${true}     | ${4}
  ${dobonNum_1} | ${bonusCards_2}  |    ${true}     | ${12}
  ${dobonNum_1} | ${bonusCards_3}  |    ${true}     | ${32}
  ${dobonNum_1} | ${bonusCards_4}  |    ${true}     | ${48}
  ${dobonNum_1} | ${bonusCards_10} |    ${true}     | ${184}
  ${dobonNum_8} | ${bonusCards_1}  |    ${false}    | ${16}
  ${dobonNum_8} | ${bonusCards_2}  |    ${false}    | ${48}
  ${dobonNum_8} | ${bonusCards_3}  |    ${false}    | ${128}
  ${dobonNum_8} | ${bonusCards_4}  |    ${false}    | ${192}
  ${dobonNum_8} | ${bonusCards_10} |    ${false}    | ${736}
  ${dobonNum_8} | ${bonusCards_1}  |    ${true}     | ${32}
  ${dobonNum_8} | ${bonusCards_2}  |    ${true}     | ${96}
  ${dobonNum_8} | ${bonusCards_3}  |    ${true}     | ${256}
  ${dobonNum_8} | ${bonusCards_4}  |    ${true}     | ${384}
  ${dobonNum_8} | ${bonusCards_10} |    ${true}     | ${1472}
  `('$card should be', ({ dobonNum, bonusCards, isReverseDobon, expected }) => {
    test(`returns ${expected}`, () => {
      let result = culcGetScore({ dobonNum, bonusCards, isReverseDobon, winner:playersMock_2_winner_2_loser.winner, loser: playersMock_2_winner_2_loser.loser })
      expect(result).toBe(expected)
    })
  })
})

describe('Score TestCases - 天和ドボンが全員で発生した場合、スコアレスドロー', () => {
  describe.each`
    dobonNum    |   bonusCards     | isReverseDobon | expected
  ${dobonNum_0} | ${bonusCards_1}  |    ${false}    | ${0}
  ${dobonNum_0} | ${bonusCards_2}  |    ${false}    | ${0}
  ${dobonNum_0} | ${bonusCards_3}  |    ${false}    | ${0}
  ${dobonNum_0} | ${bonusCards_4}  |    ${false}    | ${0}
  ${dobonNum_0} | ${bonusCards_10} |    ${false}    | ${0}
  ${dobonNum_0} | ${bonusCards_1}  |    ${true}     | ${0}
  ${dobonNum_0} | ${bonusCards_2}  |    ${true}     | ${0}
  ${dobonNum_0} | ${bonusCards_3}  |    ${true}     | ${0}
  ${dobonNum_0} | ${bonusCards_4}  |    ${true}     | ${0}
  ${dobonNum_0} | ${bonusCards_10} |    ${true}     | ${0}
  ${dobonNum_1} | ${bonusCards_1}  |    ${false}    | ${0}
  ${dobonNum_1} | ${bonusCards_2}  |    ${false}    | ${0}
  ${dobonNum_1} | ${bonusCards_3}  |    ${false}    | ${0}
  ${dobonNum_1} | ${bonusCards_4}  |    ${false}    | ${0}
  ${dobonNum_1} | ${bonusCards_10} |    ${false}    | ${0}
  ${dobonNum_1} | ${bonusCards_1}  |    ${true}     | ${0}
  ${dobonNum_1} | ${bonusCards_2}  |    ${true}     | ${0}
  ${dobonNum_1} | ${bonusCards_3}  |    ${true}     | ${0}
  ${dobonNum_1} | ${bonusCards_4}  |    ${true}     | ${0}
  ${dobonNum_1} | ${bonusCards_10} |    ${true}     | ${0}
  ${dobonNum_8} | ${bonusCards_1}  |    ${false}    | ${0}
  ${dobonNum_8} | ${bonusCards_2}  |    ${false}    | ${0}
  ${dobonNum_8} | ${bonusCards_3}  |    ${false}    | ${0}
  ${dobonNum_8} | ${bonusCards_4}  |    ${false}    | ${0}
  ${dobonNum_8} | ${bonusCards_10} |    ${false}    | ${0}
  ${dobonNum_8} | ${bonusCards_1}  |    ${true}     | ${0}
  ${dobonNum_8} | ${bonusCards_2}  |    ${true}     | ${0}
  ${dobonNum_8} | ${bonusCards_3}  |    ${true}     | ${0}
  ${dobonNum_8} | ${bonusCards_4}  |    ${true}     | ${0}
  ${dobonNum_8} | ${bonusCards_10} |    ${true}     | ${0}
  `('$card should be', ({ dobonNum, bonusCards, isReverseDobon, expected }) => {
    test(`returns ${expected}`, () => {
      let result = culcGetScore({ dobonNum, bonusCards, isReverseDobon, winner:playersMock_4_winner_0_loser.winner, loser: playersMock_4_winner_0_loser.loser })
      expect(result).toBe(expected)
    })
  })
})