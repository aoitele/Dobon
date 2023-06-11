import deepcopy from 'deepcopy'
import { updatePrediction, UpdatePredictionArgs } from '../../utils/game/cpu/thinking/putout/updatePrediction'

const CARD_INFO_INIT: UpdatePredictionArgs['detectionInfo'] = {
  0: { remain:2, prediction:0 },
  1: { remain:4, prediction:0 },
  2: { remain:4, prediction:0 },
  3: { remain:4, prediction:0 },
  4: { remain:4, prediction:0 },
  5: { remain:4, prediction:0 },
  6: { remain:4, prediction:0 },
  7: { remain:4, prediction:0 },
  8: { remain:4, prediction:0 },
  9: { remain:4, prediction:0 },
  10: { remain:4, prediction:0 },
  11: { remain:4, prediction:0 },
  12: { remain:4, prediction:0 },
  13: { remain:4, prediction:0 },
}

/**
 * 指定したキーの残枚数を0にする関数
 * optionで指定した数字は指定枚数にできる
 */
interface Remain2ZeroProps {
  zeroNumbers: number[],
  options?: {
    [key in string]: { remain: number }
  }
}

const updateRemain = ({ zeroNumbers, options }: Remain2ZeroProps) => {
  const res = deepcopy(CARD_INFO_INIT)
  for (let [k, v] of Object.entries(res)) {
    if (zeroNumbers.includes(+k)) {
      v.remain = 0
    }
  }
  if (options) {
    for (let [k, v] of Object.entries(options)) {
      res[+k].remain = v.remain
    }
  }
  return res
}

/**
 * 数字ごとに被ドボン確率を算出する関数(updatePrediction)のテスト
 * 
 * テストケース
 * - 予測を行わない場合(全てオープンカードで予測する必要がないため)
 * - 全ての数字に予測値が加算される場合
 * - 一部の数字は予測が加算されない場合(手札と残カードで待ちとして成立しないため)
 */
describe('updatePrediction TestCases', () => {
  it('全てオープンカードの場合は情報を更新しない', () => {
    const args: UpdatePredictionArgs = {
      otherHands:[
        { userId: 1, hands: ['c10o', 'c11o']}
      ],
      detectionInfo: CARD_INFO_INIT,
    }
    const result = updatePrediction(args)
    expect(result).toEqual(CARD_INFO_INIT)
  })
  it('全てクローズカード（手札2枚の場合） - 全数字にprediction値が入る', () => {
    const args: UpdatePredictionArgs = {
      otherHands:[
        { userId: 1, hands: ['z', 'z']}
      ],
      detectionInfo: CARD_INFO_INIT,
    }
    const result = updatePrediction(args)
    // 全数字のpredictionが0以上になっているか
    const test = (obj: UpdatePredictionArgs['detectionInfo'] | undefined) => {
      if (!obj) return false

      for (const [_, v] of Object.entries(obj)) {
        if (typeof v.prediction === 'undefined' || v.prediction <= 0) {
          return false
        }
      }
      return true
    }
    expect(test(result)).toBe(true)
  })
  it('クローズ1枚、オープン1枚 - マチとなる数字のみprediction値が入る', () => {
    const detectionInfo = updateRemain({
      zeroNumbers: [0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    }) // 1, 2, 3のカードのみ残っている状態に
    const args: UpdatePredictionArgs = {
      otherHands:[
        { userId: 1, hands: ['c10o', 'z']}
      ],
      detectionInfo,
    }
    const expected = {
      0: { remain: 0,  prediction: 0 },
      1: { remain: 4,  prediction: 0 },
      2: { remain: 4,  prediction: 0 },
      3: { remain: 4,  prediction: 0 },
      4: { remain: 0,  prediction: 0 },
      5: { remain: 0,  prediction: 0 },
      6: { remain: 0,  prediction: 0 },
      7: { remain: 0,  prediction: 0.6666666666666666 }, // 4(remain)/12(全remain) = 0.666となる
      8: { remain: 0,  prediction: 0.6666666666666666 },
      9: { remain: 0,  prediction: 0.6666666666666666 },
      10: { remain: 0,  prediction: 0 },
      11: { remain: 0,  prediction: 0.6666666666666666 },
      12: { remain: 0,  prediction: 0.6666666666666666 },
      13: { remain: 0,  prediction: 0.6666666666666666 }
    }
    const result = updatePrediction(args)
    expect(result).toEqual(expected)
  })
})
