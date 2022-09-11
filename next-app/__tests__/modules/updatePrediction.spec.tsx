import { updatePrediction, UpdatePredictionArgs } from '../../utils/game/cpu/thinking/putout/updatePrediction'

const AVAILABLE_NUMBER_FULL: UpdatePredictionArgs['availableNumber'] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
]

const USEFUL_INFO_INIT: UpdatePredictionArgs['usefulInfo'] = {
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
      otherHand:['c10o', 'c11o'],
      availableNumber: AVAILABLE_NUMBER_FULL,
      usefulInfo: USEFUL_INFO_INIT,
    }
    const result = updatePrediction(args)
    expect(result).toEqual(USEFUL_INFO_INIT)
  })
  // it('全てクローズカードで予測', () => {
  //   const args: UpdatePredictionArgs = {
  //     otherHand:['z', 'z'],
  //     availableNumber: AVAILABLE_NUMBER_FULL,
  //     usefulInfo: USEFUL_INFO_INIT,
  //   }
  //   const result = updatePrediction(args)
  //   expect(result).toEqual(USEFUL_INFO_INIT)
  // })
})
