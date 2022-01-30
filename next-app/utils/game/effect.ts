/**
 * State.game.event.actionの判定等に使う関数群
 */

import { HandCards } from "../../@types/card"
import { ModalEffect, Effect } from "../../@types/game"

const modalEffect: ModalEffect['action'][] = [
  'avoidEffect',
  'notAvoidEffect',
  'skip',
  'draw',
  'draw2',
  'draw4',
  'draw6',
  'draw8',
  'wild',
  'reverse',
  'opencard',
  'dobon',
  'dobonsuccess',
  'dobonfailure'
]

type CardEffects = {
  [key:number]: Effect
}
const cardEffects: CardEffects = {
  0: 'wild',
  1: 'skip',
  2: 'draw2',
  8: 'wild',
  11: 'reverse',
  13: 'opencard'
}

const rankCardNums = [0, 1, 2, 8, 11, 13]

const isModalEffect = (action: string | null) => typeof action === 'string' && modalEffect.includes(action)
const resEffectName = (card: HandCards | string) => {
  const re = /[0-9]+/gu
  const mat = card.match(re)
  const _mat = mat ? mat[0]: null
  if (_mat === null) return ''
  return rankCardNums.includes(Number(_mat)) ? cardEffects[Number(_mat)] : ''
}

export { modalEffect, isModalEffect, resEffectName }