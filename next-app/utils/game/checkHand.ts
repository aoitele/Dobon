import { Dispatch } from 'react'
import { Board, Action } from '../../@types/game'
import { HandCards } from '../../@types/card'
import { useUpdateStateFn } from './state'
import { gameInitialState, Action as StateAction } from './roomStateReducer'
import { AuthState } from '../../context/authProvider'
import hasProperty from '../function/hasProperty'

const card2 = Number(process.env.NEXT_PUBLIC_RANK_CARD_DRAWTWO)
const card13 = Number(process.env.NEXT_PUBLIC_RANK_CARD_OPENCARD)

const isPutOut2or13 = (putOutCard: number) =>
  [card2, card13].includes(putOutCard)
const hasSameCard = (putOutCard: number, hand: number[]): boolean =>
  hand.includes(putOutCard)
const chkAvoidCardEffect = (action: Action) => action === 'avoidEffect'

const sepalateSuitNum = (cards: Board['hands'] | Board['trash']) => {
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

const cardsICanPutOut = (hands:string[] | HandCards[], trash:Board['trash']) => {
  if (!trash.length) return []
  const handsSep = sepalateSuitNum(hands)
  const trashSep = sepalateSuitNum(trash)
  const { suit, num } = trashSep[0]
  if (suit === 'x') return hands // Trash - joker is all card allow put
  const filteredHands = handsSep.filter(_ => _.suit === suit || _.suit === 'x' || _.num === num || _.num === '8')
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
  dispatch: Dispatch<StateAction>
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

const updateMyHandsStatus = ({state, hands, trash, dispatch}: UpdateHandProps) => {
  // 場に出せる手札を判定、isPutable=trueにする(['${suit}${num}op', ...])
  const putableCards = cardsICanPutOut(hands,trash)
  console.log(hands, 'hands')
  console.log(putableCards, 'putableCards')
  const newHands = hands.map(_ => putableCards.includes(_) ? `${_}p`: `${_}`)
  const data = {
    game: {
      board: {
        hands: newHands
      }
    }
  }
  const newState = useUpdateStateFn(state, data)
  dispatch({ type: 'updateStateSpecify', payload: newState })
}

const resetMyHandsStatus = ({state, hands, dispatch}: ResetHandProps) => {
  console.log('resetMyHandsStatus fire')
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
  dispatch({ type: 'updateStateSpecify', payload: newState })  
}

export { isPutOut2or13, hasSameCard, chkAvoidCardEffect, cardsICanPutOut, updateHandsFn, updateMyHandsStatus, resetMyHandsStatus }
