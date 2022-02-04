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

type EffectStateTreatFn = (effect: Effect[], effectName: Effect | '') => Effect[] // eslint-disable-line no-unused-vars

/**
 * @param effect boardState.effect
 * @param effectName putout card's effect
 * @returns New boardState.effect
 */
const resNewEffectState:EffectStateTreatFn = (effect, effectName) => {
  let res = effect
  // 現効果が空の場合、追加して返却
  if (res.length === 0 && effectName !== '') {
    res.push(effectName)
    return res
  }
  // 以降、現効果が存在する場合
  res = treatReverseEffect(res, effectName)
  res = treatWildEffect(res, effectName)
  res = treatDrawEffect(res, effectName)
  return res
}

/**
 * リバース処理。既にeffectに存在する場合は削除され、無い場合は追加。
 */
const treatReverseEffect:EffectStateTreatFn = (effect, effectName) => {
  let res = effect
  if (effectName !== 'reverse') return res

  res.includes(effectName)
  ? res = effect.filter(_ => _ !== effectName)
  : res.push(effectName)
  return res
}

/**
 * ワイルド処理。
 * 現効果にワイルドがあり、出されたカードがワイルドでない場合→現効果からワイルドが消える
 * 現効果にワイルドがあり、出されたカードがワイルドの場合→現効果からワイルドを上書き
 * 現効果にワイルドがなく、出されたカードがワイルドの場合→現効果にワイルドを追加
 * 現効果にワイルドがなく、出されたカードがワイルドでない場合→なにもしない
 */
const treatWildEffect:EffectStateTreatFn = (effect, effectName) => {
  let res = effect
  const regexMatchWild = (arg: Effect) => arg.match(/wild/gu)
  const wildEffectArray = res.filter(_ => regexMatchWild(_)) // 現効果にワイルドが存在するか
  const reMatchWild = (effectName === '') ? null : regexMatchWild(effectName) // 出されたカードがワイルドか

  if (wildEffectArray.length || reMatchWild) {
    res = res.filter(_ => !(regexMatchWild(_))) // 現効果からwild削除
    if (reMatchWild && effectName !== '') {
      res.push(effectName) // Wildカードが出された場合は追加
    }
  }
  return res
}

/**
 * ドロー処理。
 * 現効果にdrawがない場合→現効果に追加
 * 現効果にdrawがある場合→draw+2した効果で上書き
 */
const treatDrawEffect:EffectStateTreatFn = (effect, effectName) => {
  let res = effect
  const regexMatchDraw = (arg: Effect) => arg.match(/draw(2|4|6)/gu)
  const drawEffectArray = res.filter(_ => regexMatchDraw(_)) // 現効果にドローが存在するか
  const reMatchDraw = (effectName === '') ? null : regexMatchDraw(effectName) // 出されたカードがドローか

  if (!drawEffectArray.length && reMatchDraw && effectName !== '') {
    res.push(effectName)
    return res
  }

  const v = drawEffectArray[0]
  const _effectName =
  v === 'draw2' ? 'draw4' :
  v === 'draw4' ? 'draw6' :
  v === 'draw6' ? 'draw8' : ''
  res = effect.filter(_ => !(regexMatchDraw(_))) // 現効果からdraw削除

  if (_effectName !== '') {
    res.push(_effectName)
  }
  return res
}

export { modalEffect, isModalEffect, resEffectName, resNewEffectState }