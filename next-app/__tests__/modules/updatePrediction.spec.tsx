import { updatePrediction, UpdatePredictionArgs } from '../../utils/game/cpu/thinking/putout/updatePrediction'

const CARD_INFO_INIT: UpdatePredictionArgs['cardInfo'] = {
  0: { remain:2, incidence: 0, prediction:0 },
  1: { remain:4, incidence: 0, prediction:0 },
  2: { remain:4, incidence: 0, prediction:0 },
  3: { remain:4, incidence: 0, prediction:0 },
  4: { remain:4, incidence: 0, prediction:0 },
  5: { remain:4, incidence: 0, prediction:0 },
  6: { remain:4, incidence: 0, prediction:0 },
  7: { remain:4, incidence: 0, prediction:0 },
  8: { remain:4, incidence: 0, prediction:0 },
  9: { remain:4, incidence: 0, prediction:0 },
  10: { remain:4, incidence: 0, prediction:0 },
  11: { remain:4, incidence: 0, prediction:0 },
  12: { remain:4, incidence: 0, prediction:0 },
  13: { remain:4, incidence: 0, prediction:0 },
}

/**
 * 数字ごとに被ドボン確率を算出する関数(updatePrediction)のテスト
 * 
 * テストケース
 * - 
 */
describe('updatePrediction TestCases', () => {
  it('全てオープンカードの場合は情報を更新しない', () => {
    const args: UpdatePredictionArgs = {
      otherHandsArray:[
        { userId: 1, hands: ['c10o', 'c11o']}
      ],
      cardInfo: CARD_INFO_INIT,
    }
    const result = updatePrediction(args)
    expect(result).toEqual(CARD_INFO_INIT)
  })
  it('全てクローズカード（手札2枚、の場合）', () => {
    const args: UpdatePredictionArgs = {
      otherHandsArray:[
        { userId: 1, hands: ['z', 'z']}
      ],
      cardInfo: CARD_INFO_INIT,
    }
    const result = updatePrediction(args)
    expect(result).toEqual(CARD_INFO_INIT)
  })
})
