import deepcopy from "deepcopy"
import { culcPositiveScore, CulcPositiveScoreParams, POSITIVESCORE_REVERSE_DOBON } from "../../utils/game/cpu/thinking/putout/culcPositiveScore"
import { DETECTION_INFO_INIT_DATA } from "../__mocks__/data/detectionInfo"

const OWNHANDS_HASNOT_REACH_HASNOT_SCORE: CulcPositiveScoreParams['ownHands'] = {
  userId: 0,
  hands: ['d5', 'd8', 'd9', 's11', 's13'] // どのカードを出してもドボン返しやリーチが作れない、次のターンでもリーチを作れない。
}

const OWNHANDS_HASNOT_REACH_HAS_SCORE: CulcPositiveScoreParams['ownHands'] = {
  userId: 0,
  hands: ['d5', 'd8', 'd9', 's11'] // どのカードを出してもドボン返しやリーチが作れないが、次のターンでリーチを作れる。
}

const OWNHANDS_HAS_DOBON_ALL: CulcPositiveScoreParams['ownHands'] = {
  userId: 0,
  hands: ['d1', 'd6', 'd7'] // どのカードを出してもドボン返しを作れる手札である
}
const OWNHANDS_HAS_DOBON: CulcPositiveScoreParams['ownHands'] = {
  userId: 0,
  hands: ['d1', 'd5', 'd6', 'd12'] // 特定のカード(d12)を出せばドボン返しを作れる手札である
}

const OWNHANDS_HAS_JOKER: CulcPositiveScoreParams['ownHands'] = {
  userId: 0,
  hands: ['d5', 'd8', 'x0', 'x1'] // どのカードを出してもリーチが作れる
}

const CASE_NOT_SCORE = { ownHands: OWNHANDS_HASNOT_REACH_HASNOT_SCORE, prediction:DETECTION_INFO_INIT_DATA }
const CASE_ADD_SCORE = { ownHands: OWNHANDS_HASNOT_REACH_HAS_SCORE, prediction:DETECTION_INFO_INIT_DATA }
const CASE_HAS_DOBON_ALL = { ownHands: OWNHANDS_HAS_DOBON_ALL, prediction:DETECTION_INFO_INIT_DATA }
const CASE_HAS_DOBON_D12 = { ownHands: OWNHANDS_HAS_DOBON, prediction:DETECTION_INFO_INIT_DATA }
const CASE_HAS_DOBON_JOKER = { ownHands: OWNHANDS_HAS_JOKER, prediction:DETECTION_INFO_INIT_DATA }

describe('culcPositiveScore TestCases', () => {
  it('手札でドボン返し/リーチともに作れず、次のターンでもリーチを作れない場合 - positiveScoreは加算されない', () => {
    const result = culcPositiveScore(CASE_NOT_SCORE)
    const expected = deepcopy(DETECTION_INFO_INIT_DATA)
    expected[5].positiveSuit = 'd'
    expected[8].positiveSuit = 'd'
    expected[9].positiveSuit = 'd'
    expected[11].positiveSuit = 's'
    expected[13].positiveSuit = 's'
    expect(result).toEqual(expected)
  })
  it('手札でドボン返し/リーチともに作れず、次のターンでリーチを作れる場合 - positiveScoreは加算される', () => {
    const result = culcPositiveScore(CASE_ADD_SCORE)
    const expected = deepcopy(DETECTION_INFO_INIT_DATA)
    expected[5]  = {...expected[5], positiveScore: 0.30000000000000004, positiveSuit: 'd'}   // 0.1 * reachNums.length(3)
    expected[8]  = {...expected[8], positiveScore: 0.30000000000000004, positiveSuit: 'd'}   // 0.1 * reachNums.length(3)
    expected[9]  = {...expected[8], positiveScore: 0.4, positiveSuit: 'd'}   // 0.1 * reachNums.length(4)
    expected[11] = {...expected[11], positiveScore: 0.4, positiveSuit: 's'} // 0.1 * reachNums.length(4)
    expect(result).toEqual(expected)
  })
  it('どのカードを出してもドボン返しを作れる場合 - POSITIVESCORE_REVERSE_DOBONが加算される', () => {
    const result = culcPositiveScore(CASE_HAS_DOBON_ALL)
    const expected = deepcopy(DETECTION_INFO_INIT_DATA)
    expected[1] = {...expected[5], positiveScore: POSITIVESCORE_REVERSE_DOBON, positiveSuit: 'd'}
    expected[6] = {...expected[8], positiveScore: POSITIVESCORE_REVERSE_DOBON, positiveSuit: 'd'}
    expected[7] = {...expected[8], positiveScore: POSITIVESCORE_REVERSE_DOBON, positiveSuit: 'd'}
    expect(result).toEqual(expected)
  })
  it('特定のカード(d12)を出せばドボン返しを作れる手札の場合 - 12を高スコアとしてpositiveScoreが加算される', () => {
    const result = culcPositiveScore(CASE_HAS_DOBON_D12)
    const expected = deepcopy(DETECTION_INFO_INIT_DATA)
    expected[1] = {...expected[1], positiveScore: 0.4, positiveSuit: 'd'}// 0.1 * reachNums.length(4)
    expected[5] = {...expected[5], positiveScore: 0.5, positiveSuit: 'd'}// 0.1 * reachNums.length(5)
    expected[6] = {...expected[6], positiveScore: 0.5, positiveSuit: 'd'}// 0.1 * reachNums.length(5)
    expected[12] = {...expected[12], positiveScore: POSITIVESCORE_REVERSE_DOBON, positiveSuit: 'd'}
    expect(result).toEqual(expected)
  })
  it('どのカードを出してもリーチを作れる場合（Jokerあり） - 加算される', () => {
    const result = culcPositiveScore(CASE_HAS_DOBON_JOKER)
    const expected = deepcopy(DETECTION_INFO_INIT_DATA)
    expected[0] = {...expected[0], positiveScore: 0.7999999999999999, positiveSuit: null} // 0.1 * reachNums.length(6) + 0.2 * reachNums.length(1)
    expected[5] = {...expected[5], positiveScore: 51.1, positiveSuit: 'd'} // 10 * reachNums.length(5) + 20 * reachNums.length(3) + POSITIVESCORE_REVERSE_DOBON_NEXT_TURN(50)
    expected[8] = {...expected[8], positiveScore: 51.1, positiveSuit: 'd'} // 10 * reachNums.length(5) + 20 * reachNums.length(3) + POSITIVESCORE_REVERSE_DOBON_NEXT_TURN(50)
    expect(result).toEqual(expected)
  })
})
  