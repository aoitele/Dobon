import { Dispatch, SetStateAction } from 'react'
import { Board, Action } from '../../@types/game'
import { HandCards } from '../../@types/card'
import { AnotateState, useUpdateStateFn } from './state'
import { gameInitialState, Action as StateAction } from './roomStateReducer'
import { AuthState } from '../../context/AuthProvider'
import hasProperty from '../function/hasProperty'
import { extractPutableSuitStr } from './effect'
import { GameProviderState } from '../../context/GameProvider'

const card2 = Number(process.env.NEXT_PUBLIC_RANK_CARD_DRAWTWO)
const card13 = Number(process.env.NEXT_PUBLIC_RANK_CARD_OPENCARD)

const isPutOut2or13 = (putOutCard: number) =>
  [card2, card13].includes(putOutCard)
const hasSameCard = (putOutCard: number, hand: number[]): boolean =>
  hand.includes(putOutCard)
const chkAvoidCardEffect = (action: Action) => action === 'avoidEffect'

const sepalateSuitNum = (cards: string[] | HandCards[]) => {
  const res = []
  for (let i=0; i<cards.length; i+=1 ){
    const re = /(h|s|c|d|x)([0-9]+)(op|o|p|)/u
    const mat = cards[i].match(re)
    if (mat) {
      if (mat[3]) {
        res.push({ suit: mat[1], num: mat[2], isOpen: mat[3] === 'op' || mat[3] === 'o', isPutable: mat[3] === 'op' || mat[3] === 'p' })
      } else {
        res.push({ suit: mat[1], num: mat[2], isOpen:false, isPutable:false })
      }
    }
  }
  return res
}

interface HandSep {
  suit: string
  num: string
  isOpen: boolean
  isPutable: boolean
}

type HandsFilterCallback = (handSep: HandSep) => boolean // eslint-disable-line no-unused-vars

const cardsICanPutOut = (hands:string[] | HandCards[], trash:Board['trash']['card'], effect?:Board['effect']) => {
  if (!trash || hands.length === 1) return []
  const handsSep = sepalateSuitNum(hands)
  const trashSep = sepalateSuitNum([trash])
  const { suit, num } = trashSep[0]
  if (suit === 'x') return hands // Trash - joker is all card allow put

  /**
   * Wild effectが場にある時、出せるカード条件は下記となる
   * ある場合：選択された柄、ジョーカー(suit:x)、wildカード(num:8)
   * ない場合：trashの(数字 or 柄)、ジョーカー(suit:x)、wildカード(num:8)、
   */
  const putableSuit = effect ? extractPutableSuitStr({ effect, isShorten:true }) : ''

  const filterCallback: HandsFilterCallback = (putableSuit === '')
  ? (arg: HandSep) => (arg.suit === suit || arg.suit === 'x' || arg.num === num || arg.num === '8')
  : (arg: HandSep) => (arg.suit === putableSuit || arg.suit === 'x' || arg.num === '8')

  const filteredHands = handsSep.filter(_ => filterCallback(_))
  return filteredHands.map(_=>`${_.suit}${_.num}${_.isOpen?'o':''}${_.isPutable?'p':''}`)
}

interface UpdateHandFnProps {
  state:gameInitialState
  authUser:AuthState['authUser']
  dispatch:Dispatch<StateAction>
}

interface UpdateHandProps {
  state: gameInitialState
  hands: Board['hands']
  trash: Board['trash']
  dispatch?: Dispatch<StateAction>
}

type ResetHandProps = Omit<UpdateHandProps, 'trash'>


const updateHandsFn = ({ state, authUser, dispatch} : UpdateHandFnProps) => {
  if (!hasProperty(state.game, 'board') || !authUser) return
  const { users, turn, hands, trash } = state.game.board
  if (!users || !turn || !hands) return

  const me = state.game?.board.users.filter(_ => _.id === authUser.id)[0]
  const isMyTurn = (me && me.turn === turn)
  isMyTurn
  ? updateMyHandsStatus({state, hands, trash, dispatch})
  : resetMyHandsStatus({state, hands, dispatch})
}

const updateMyHandsStatus = ({state, hands, trash, dispatch}: UpdateHandProps): void | AnotateState => {
  // 場に出せる手札を判定、isPutable=trueにする(['${suit}${num}op', ...])
  const effect = state.game?.board.effect
  const putableCards = cardsICanPutOut(hands, trash.card, effect)
  const newHands = hands.map(_ => putableCards.includes(_) ? `${_}p`: `${_}`)
  const data = {
    game: {
      board: {
        hands: newHands
      }
    }
  }
  const newState = useUpdateStateFn(state, data)
  return dispatch ? dispatch({ type: 'updateStateSpecify', payload: newState }) : newState
}

const resetMyHandsStatus = ({state, hands, dispatch}: ResetHandProps): void | AnotateState => {
  // IsPutable=falseにする
  const newHands = hands.map(_ => _.replace('p', ''))
  const data = {
    game: {
      board: {
        hands: newHands
      }
    }
  }
  const newState = useUpdateStateFn(state, data)
  return dispatch ? dispatch({ type: 'updateStateSpecify', payload: newState }) : newState
}

const resMyHandsCardNumbers = (hands: Board['hands']) => {
  const res = hands.map(hand => Number(hand.replace(/[^0-9]/gu, '')))
  return res
}

const cntCloseCard = (hands: string[] | HandCards[]) => {
  const unknownCardCnt = hands.filter(hand => hand === 'z').length
  const handsSep = sepalateSuitNum(hands)
  const cntClose = handsSep.filter(hand => !hand.isOpen).length

  return unknownCardCnt + cntClose
}

/**
 * 手札情報を渡して公開カードの数値を返す関数
 * 重複数字があっても一意にせずそのまま返す
 */
const resOpenCardNumbers = (hands: string[] | HandCards[]):number[] => {
  const handsSep = sepalateSuitNum(hands)
  return handsSep.filter(hand => hand.isOpen).map(item => Number(item.num))
}

export { isPutOut2or13, hasSameCard, chkAvoidCardEffect, cardsICanPutOut, updateHandsFn, updateMyHandsStatus, resetMyHandsStatus, resMyHandsCardNumbers, cntCloseCard, sepalateSuitNum, resOpenCardNumbers }
