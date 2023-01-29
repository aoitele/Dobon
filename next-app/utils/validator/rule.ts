/**
 * サーバーに送られたemitDataのバリデーション
 * emitDataは任意の型でサーバーにデータを送る事ができるため
 * 各イベントで使用するプロパティの存在をチェックする必要がある
 * （一旦BoardEmitに限定して作成している）
 */
import { Board } from "../../@types/game"
import { Emit, EmitDataType } from "../../@types/socket"

export type Rules = {
  [key in NonNullable<Emit['event']>]?: { // keyは検証するイベント名
    dataType: EmitDataType, // 送られるデータ型の指定
    required: (keyof Board)[] // 必須とするプロパティ
  }
}

const validateRules: Rules = {
  cpuTurn: {
    dataType: 'board',
    required: ['turn', 'trash', 'users', 'hands', 'otherHands', 'effect']
  }
}

export { validateRules }