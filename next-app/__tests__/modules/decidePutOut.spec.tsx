/**
 * 手札から出せるカード（putableCards）に優先度をつける関数のテストケース
 */
import { addDecitionScore, AddDecitionScoreParams, AddDecitionScoreResponse } from '../../utils/game/cpu/thinking/putout/decidePutOut'
import { DETECTION_INFO_INIT_DATA } from '../__mocks__/data/detectionInfo'
 
const DEFAULT_INPUT:AddDecitionScoreParams = {
  detectionInfo: DETECTION_INFO_INIT_DATA,
  cpuLevel: 'normal',
  putableCards: []
}

const PUTABLE_CARDS              = ['d1', 'c5', 'd2', 's4'] // 同じ数字がない状況を想定
const PUTABLE_CARDS_HAS_SAME_NUM = ['d1', 'c2', 'd2', 'd6'] // positiveSuitがdとなる状況を想定
const PUTABLE_CARDS_WITH_JOKER   = ['d1', 'c2', 'd2', 's3', 'x1'] // 「x1」ジョーカーも持つ場合を想定

describe('addDecitionScore TestCases', () => {
  it('同数字のカードがない場合 - putableCards内ではスコアが低いカードを前にする', () => {
    const input = {
      ...DEFAULT_INPUT,
      detectionInfo: {
        ...DETECTION_INFO_INIT_DATA,
        1: { remain:3, prediction:10, damageRisk:0, positiveScore: 0, positiveSuit: null }, // 高リスク
        2: { remain:3, prediction:0,  damageRisk:0, positiveScore: 0, positiveSuit: null },  // 低リスク
        4: { remain:3, prediction:-5, damageRisk:0, positiveScore: 0, positiveSuit: null }, // 最低リスク
        5: { remain:3, prediction:5,  damageRisk:0, positiveScore: 0, positiveSuit: null },  // 中リスク
      },
      putableCards: PUTABLE_CARDS
    }
    const expected: AddDecitionScoreResponse = {
      decition: [
        { card: "s4", score: -5 },
        { card: "d2", score: 0 },
        { card: "c5", score: 5 },
        { card: "d1", score: 10 },
      ]
    }
    expect(addDecitionScore(input)).toEqual(expected)
  })
  it('同数字のカードがありpositiveSuitがnullの場合 - putableCardで先にある方が前となる', () => {
    const input = {
      ...DEFAULT_INPUT,
      detectionInfo: {
        ...DETECTION_INFO_INIT_DATA,
        1: { remain:3, prediction:10, damageRisk:0, positiveScore: 0, positiveSuit: null },
        2: { remain:2, prediction:0,  damageRisk:0, positiveScore: 0, positiveSuit: null },
        6: { remain:3, prediction:5,  damageRisk:0, positiveScore: 0, positiveSuit: null },
      },
      putableCards: PUTABLE_CARDS_HAS_SAME_NUM
    }
    const expected: AddDecitionScoreResponse = {
      decition: [
        { card: "c2", score: 0 },
        { card: "d2", score: 0 },
        { card: "d6", score: 5 },
        { card: "d1", score: 10 },
      ]
    }
    expect(addDecitionScore(input)).toEqual(expected)
  })
  it('同数字のカードがありpositiveSuit指定に合致する場合 - 同じ数字のカードではpositiveSuitがある方を前にする', () => {
    const input = {
      ...DEFAULT_INPUT,
      detectionInfo: {
        ...DETECTION_INFO_INIT_DATA,
        1: { remain:3, prediction:10, damageRisk:0, positiveScore: 0, positiveSuit: null },
        2: { remain:2, prediction:0,  damageRisk:0, positiveScore: 0, positiveSuit: 'd' },
        6: { remain:3, prediction:5,  damageRisk:0, positiveScore: 0, positiveSuit: null },
      },
      putableCards: PUTABLE_CARDS_HAS_SAME_NUM
    }
    const expected: AddDecitionScoreResponse = {
      decition: [
        { card: "d2", score: 0 },
        { card: "c2", score: 0 },
        { card: "d6", score: 5 },
        { card: "d1", score: 10 },
      ]
    }
    expect(addDecitionScore(input)).toEqual(expected)
  })
  it('Jokerは0として扱われている', () => {
    const input = {
      ...DEFAULT_INPUT,
      detectionInfo: {
        ...DETECTION_INFO_INIT_DATA,
        0: { remain:1, prediction:30, damageRisk:0, positiveScore: 0, positiveSuit: null },
        1: { remain:3, prediction:10, damageRisk:0, positiveScore: 0, positiveSuit: null },
        2: { remain:3, prediction:0,  damageRisk:0, positiveScore: 0, positiveSuit: null },
        3: { remain:3, prediction:0,  damageRisk:0, positiveScore: 0, positiveSuit: null },
      },
      putableCards: PUTABLE_CARDS_WITH_JOKER
    }
    const expected: AddDecitionScoreResponse = {
      decition: [
        { card: "c2", score: 0 },
        { card: "d2", score: 0 },
        { card: "s3", score: 0 },
        { card: "d1", score: 10 },
        { card: "x1", score: 30 },
      ]
    }
    expect(addDecitionScore(input)).toEqual(expected)
  })
})
 