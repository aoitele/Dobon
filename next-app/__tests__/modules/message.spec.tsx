import { suitNameTo__Ja, createMsg } from "../../utils/game/message";
import { Player, AllActionType } from '../../@types/game'
import { HandCards } from "../../@types/card";

const user:Player = {
     id: 1,
     nickname: 'taro',
     turn: 1,
     score: 0,
     isWinner: false,
     isLoser: false
} 

describe('suitNameTo__Ja TestCases', () => {
  it('カード名を渡して、柄(日本語)と数字を取得する', () => {
    const card1 = 'h1o'
    const card2 = 'c2o'
    const card3 = 's10o'
    const card4 = 'd13o'
    const card5 = 'x0o'

    const expected1 = { suit: 'ハート', num: 1 }    
    const expected2 = { suit: 'クラブ', num: 2 }
    const expected3 = { suit: 'スペード', num: 10 }
    const expected4 = { suit: 'ダイヤ', num: 13 }
    const expected5 = { suit: 'ジョーカー', num: 0 }

    expect(suitNameTo__Ja(card1)).toEqual(expected1)
    expect(suitNameTo__Ja(card2)).toEqual(expected2)
    expect(suitNameTo__Ja(card3)).toEqual(expected3)
    expect(suitNameTo__Ja(card4)).toEqual(expected4)
    expect(suitNameTo__Ja(card5)).toEqual(expected5)
  })
})

describe('message TestCases', () => {
  it('どぼん - 柄と数字入りのメッセージを返す', () => {
    const card: HandCards = 'c1o'
    const action: AllActionType = 'dobon'
    const info = { user, action, card }
    const result = createMsg(info)
    const expected = '「クラブの1」でどぼん！'
    expect(result).toBe(expected)
  })
  it('スキップ - メッセージを返す', () => {
    const card: HandCards = 'c1o'
    const action: AllActionType = 'skip'
    const info = { user, action, card }
    const result = createMsg(info)
    const expected = '「スキップ(1)」\n次のユーザーをスキップします'
    expect(result).toBe(expected)
  })
  it('ワイルド - メッセージを返す', () => {
    const card: HandCards = 'c8o'
    const action: AllActionType = 'wild'
    const info = { user, action, card }
    const result = createMsg(info)
    const expected = '「ワイルド(8)」\n選択した柄なら全て出せます'
    expect(result).toBe(expected)
  })
  it('イレブンバック - メッセージを返す', () => {
    const card: HandCards = 'c11o'
    const action: AllActionType = 'reverse'
    const info = { user, action, card }
    const result = createMsg(info)
    const expected = '「リバース(11)」\nターン順を反転します'
    expect(result).toBe(expected)
  })
  it('オープンカード - メッセージを返す', () => {
    const card: HandCards = 'c11o'
    const action: AllActionType = 'opencard'
    const info = { user, action, card }
    const result = createMsg(info)
    const expected = '「手札公開(13)」\n次のユーザーは手札を公開！'
    expect(result).toBe(expected)
  })
})
