/**
 * State.game.event.actionの判定等に使う関数群
 */

import { HandCards } from "../../@types/card"
import { Effect, InitialBoardState, SolvableEffects, WildEffect } from "../../@types/game"
import DobonConst from "../../constant"
import spreadCardState from "./spreadCardState"

/**
 * 下記カード効果は次ターンのユーザーで解決されるため、shouldBeSolvedEffectsの複数共存はない
 * 'dobonfailure'も(誤どぼん)→(他ユーザーがどぼんできるかチェック)の1回で解決される
 * extractShouldBeSolvedEffect()でeffectNameを取り出す際は[0]インデックスで使用してOK
 */
const shouldBeSolvedEffects: SolvableEffects  = [
  'draw2',
  'draw4',
  'draw6',
  'draw8',
  'opencard'
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

const extractShouldBeSolvedEffect = (effect: SolvableEffects) => effect.filter(_ => shouldBeSolvedEffects.includes(_))
const existShouldBeSolvedEffect = (effect: SolvableEffects) => {
  return extractShouldBeSolvedEffect(effect).length > 0
}

const resEffectNumber = (effectName: SolvableEffects) => {
  switch(effectName[0]) {
    case 'draw2':
    case 'draw4':
    case 'draw6':
    case 'draw8':
      return DobonConst.DOBON_CARD_NUMBER_DRAW_2
    case 'opencard':
      return DobonConst.DOBON_CARD_NUMBER_OPENCARD
    default: return null
  }
}

interface resEffectNameProps {
  card: HandCards[] | string[]
  selectedWildCard:InitialBoardState['selectedWildCard'] | null
}

const resEffectName = ({ card, selectedWildCard }:resEffectNameProps) => {
  const _card = spreadCardState(card, true)[0]
  if (_card === null) return ''
  if (_card.num === DobonConst.DOBON_CARD_NUMBER_WILD && selectedWildCard) {
    const { suit } = selectedWildCard
    const effectName: WildEffect =
    suit === 's' ? 'wildspade' :
    suit === 'h' ? 'wildheart' :
    suit === 'c' ? 'wildclub' : 'wilddia'
    return effectName
  }
  return rankCardNums.includes(_card.num) ? cardEffects[_card.num] : ''
}

interface isEffectCardProps {
  card: HandCards[] | string[]
  isMyCard: boolean
}

const isEffectCard = ({ card, isMyCard }:isEffectCardProps) => {
  const _card = spreadCardState(card, isMyCard)[0]
  if (_card === null) return false
  return rankCardNums.includes(_card.num)
}
interface ExtractPutableSuitStrProps {
  effect: Effect[]
  isShorten: boolean
}

const extractPutableSuitStr = ({
  effect,
  isShorten
}: ExtractPutableSuitStrProps): string => {
  const allEffectStr = effect.join()
  const regex = isShorten ? /wild(?<suit>c|d|h|s)/u : /wild(club|dia|heart|spade)/u
  const mat:RegExpMatchArray | null = allEffectStr.match(regex)
  return isShorten
  ? mat?.groups ? mat.groups.suit : ''
  : mat?.[0] ?? ''
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
  if (addEffectOnlyPat(effect, effectName) && effectName !== '') {
    res.push(effectName)
    return res
  }
  // 以降、現効果が存在する場合
  res = treatReverseEffect(res, effectName)
  res = treatOpenCardEffect(res, effectName)
  res = treatWildEffect(res, effectName)
  res = treatDrawEffect(res, effectName)
  return res
}

const addEffectOnlyPat = (effect:Effect[], effectName:Effect | '') => {
  const pat1 = effect.length === 0 && effectName !== ''
  const pat2 = effect.length === 1 && effect[0] === 'reverse' && effectName !== 'reverse'
  return pat1 || pat2
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
 * Opencard処理。
 * 現効果にopencardがない場合→現効果に追加
 * 現効果にopencardがある場合→現効果をそのまま返す
 */
const treatOpenCardEffect:EffectStateTreatFn = (effect, effectName) => {
  const res = effect
  if (effectName !== 'opencard') return res
  if (!res.includes(effectName)) {
    res.push(effectName)
  }
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

export { shouldBeSolvedEffects, extractShouldBeSolvedEffect, existShouldBeSolvedEffect, resEffectNumber, resEffectName, isEffectCard, resNewEffectState, extractPutableSuitStr }