/**
 * Components/boardで利用するHooks
 * boardのState更新などを行う
 */

import { useEffect } from 'react'
import { InitialBoardState } from '../@types/game'

interface Props {
  values: InitialBoardState
  setValues: React.Dispatch<React.SetStateAction<InitialBoardState>>
  initialState: InitialBoardState
  isMyTurn: boolean
}

const useBoardHooks = ({setValues, initialState, isMyTurn} : Props) => {
 
  /*
   * UseEffect(() => {
   *   // エフェクトモーダルは2秒のみ表示する
   *   if (values.event) {
   *     setTimeout(() => {
   *       setValues({ ...initialState, event:null })
   *     }, 2000)
   *   }
   * }, [values])
   */

  useEffect(() => {
    setValues({ ...initialState, ICan: { action: isMyTurn, dobon: isMyTurn } })
  }, [isMyTurn])

}
export default useBoardHooks