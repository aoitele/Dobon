/**
 * State.game.event.actionの判定等に使う関数群
 */

import { HandCards } from "../../@types/card"
import { AddableEffects, Effect, SolvableEffects, WildEffect } from "../../@types/game"
import { DOBON_CARD_NUMBER_DRAW_2, DOBON_CARD_NUMBER_WILD, DOBON_CARD_NUMBER_OPENCARD } from "../../constant"
import spreadCardState from "./spreadCardState"

/**
 * BoardState.effectに入れることができる効果
 * 盤面の現効果にこれらが存在するため、出されたカードにより効果を解決していく事になる
 */
const addableEffects: AddableEffects = [
  'draw2',
  'draw4',
  'draw6',
  'draw8',
  'joker',
  'opencard',
  'reverse',
  'wildclub',
  'wilddia',
  'wildheart',
  'wildspade'
]

/**
 * 下記カード効果は次ターンのユーザーで解決されるため、shouldBeSolvedEffectsの複数共存はない
 * 'dobonfailure'も(誤どぼん)→(他ユーザーがどぼんできるかチェック)の1回で解決される
 * extractShouldBeSolvedEffect()でeffectNameを取り出す際は[0]インデックスで使用してOK
 */
const shouldBeSolvedEffects: SolvableEffects = [
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
  0: 'joker',
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
      return DOBON_CARD_NUMBER_DRAW_2
    case 'opencard':
      return DOBON_CARD_NUMBER_OPENCARD
    default: return null
  }
}

interface resEffectNameProps {
  card: HandCards[] | string[]
  selectedWildCard: {
    isSelected: boolean;
    suit: string | null | undefined;
  } | null
}

/**
 * CardEffects変数のkeyを_card.numで参照して、カード効果名を返す
 * 8の場合は選択された柄によりwildが決まる
 * jokerはdeckにx0,x1が存在するため、x1 -> x0として扱う
 */
const resEffectName = ({ card, selectedWildCard }:resEffectNameProps) => {
  const _card = spreadCardState(card, true)[0]
  if (_card === null) return ''
  if (_card.num === DOBON_CARD_NUMBER_WILD && selectedWildCard) {
    const { suit } = selectedWildCard
    const effectName: WildEffect =
    suit === 's' ? 'wildspade' :
    suit === 'h' ? 'wildheart' :
    suit === 'c' ? 'wildclub' : 'wilddia'
    return effectName
  }
  if (_card.suit === 'x' &&  _card.num === 1) {
    _card.num = 0
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
  if (_card.suit === 'x' &&  _card.num === 1) {
    _card.num = 0
  }
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
  // 現効果がない場合、追加して返却
  if (effect.length === 0 && isAddableEffect(effectName)) {
    res.push(effectName)
    return res
  }
  // 以下、現効果が存在する場合
  res = treatReverseEffect(res, effectName)
  res = treatOpenCardEffect(res, effectName)
  res = treatWildEffect(res, effectName)
  res = treatJokerEffect(res, effectName)
  res = treatDrawEffect(res, effectName)
  return res
}

/**
 * BoardState.effectに追加されるべき効果かどうかの判定
 */
const isAddableEffect = (effectName: Effect | ''): effectName is AddableEffects[number] => {
  return addableEffects.includes(effectName as AddableEffects[number])
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
 * ジョーカー処理
 * (1)現効果にジョーカーがあり、出されたカードがジョーカーの場合→なにもしない
 * (2)現効果にジョーカーがなく、出されたカードがジョーカーでない場合→なにもしない
 * (3)現効果にジョーカーがあり、出されたカードがジョーカーでない場合→現効果からジョーカーが消える
 * (4)現効果にジョーカーがなく、出されたカードがジョーカーの場合→現効果にジョーカーを追加
 */
 const treatJokerEffect:EffectStateTreatFn = (effect, effectName) => {
  let res = effect
  const isJoker = effectName === 'joker' // 出されたカードがjokerか
  const existJokerInEffect = res.includes('joker') // 現効果にjokerが存在するか

  if (existJokerInEffect && isJoker) return res // (1)
  if (!existJokerInEffect && !isJoker) return res // (2)
  if (existJokerInEffect && !isJoker) { // (3)
    res = res.filter(_ => _ !== 'joker')
  }
  if (!existJokerInEffect && effectName && isJoker) { // (4)
    res.push(effectName)
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

export { shouldBeSolvedEffects, extractShouldBeSolvedEffect, existShouldBeSolvedEffect, resEffectNumber, resEffectName, isEffectCard, resNewEffectState, extractPutableSuitStr, isAddableEffect }