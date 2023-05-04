import { useRouter } from "next/router"
import { useState, useContext } from "react"
import { CPUName, CPULevel } from "../@types/game"
import { AuthStateContext } from "../context/AuthProvider"
import { GameStateContext } from "../context/GameProvider"
import axiosInstance from "../utils/api/axiosInstance"
import { isLoggedIn } from "../utils/auth/authState"
import { isCpuLevelValue } from "../utils/game/cpu/utils/isCPULevelValue"
import { handleEmit } from "../utils/socket/emit"

interface PveSelecter {
  users: {
    name: CPUName
    mode: CPULevel
    icon: '🐰' | '🐶' | '😾'
  }[],
  setCount: number
}

const defaultValues: PveSelecter = {
  users: [
    { name: 'com1', mode: 'normal', icon: '🐰' },
    { name: 'com2', mode: 'normal', icon: '🐶' },
    { name: 'com3', mode: 'normal', icon: '😾' },
  ],
  setCount: 3,
}

interface GameStartParam {
  isCalledByResultBoard: boolean
}

const usePveSelecter = () => {
  const [pveSelecter, setPveSelecter] = useState(defaultValues)
  const { authUser } = useContext(AuthStateContext)
  const gameState = useContext(GameStateContext)
  const router = useRouter()

  const setUserMode = (e: React.ChangeEvent<HTMLSelectElement>, index:number) => {
    const users = pveSelecter.users
    if (isCpuLevelValue(e.currentTarget.value)) {
      users[index].mode = e.currentTarget.value
      setPveSelecter({...pveSelecter, users })
    }
  }

  const toPVEQueryString = (pveKey: string) => {
    let queryStr = ''
    const queryDic: {[key:string]: string} = {}

    queryStr += `pveKey=${pveKey}`
    queryStr += `&setCount=${pveSelecter.setCount}`
    if (isLoggedIn(authUser)) {
      queryStr += `&me=${authUser.nickname}`
    }
    pveSelecter.users.forEach(user => {
      queryStr += `&${user.name}=${user.mode}`
    })
    const urlSearchParams = new URLSearchParams(queryStr)
    for (const [k, v] of urlSearchParams.entries()) {
      queryDic[k] = v
    }

    return {
      queryStr,
      queryDic,
    }
  }

  const gameStart = async({ isCalledByResultBoard }: GameStartParam) => {
    let pveKey = localStorage.getItem('pveKey')
    if (!pveKey) {
      try {
        const res = await axiosInstance().get<{'pveKey': string}>('/pve-key')
        if (!res.data.pveKey) {
          throw new Error('pveKey not provided')
        }
        pveKey = res.data.pveKey
        localStorage.setItem('pveKey', pveKey)
      } catch(e) {
        alert('通信に失敗しました。時間をおいて再度お試しください。')
      }
    }
  
    if (!pveKey) return

    const { queryStr, queryDic } = toPVEQueryString(pveKey)
    // TOPページから開始される場合は/pveのビューに変遷させる
    if (!isCalledByResultBoard) {
      router.push({
        pathname: '/pve',
        query: queryStr,
      }, `/`)
    }
    
    // 前ゲームの結果画面から開始される場合はstatusを初期値(undefined)にセットしてゲーム開始のフックを発動させる
    if (isCalledByResultBoard) {
      router.replace('/') // routerはpathnameが変更されないとqueryが更新されないため、historyスタックを更新させる
      router.push({
        pathname: '/pve',
        query: queryStr,
      }, `/`)
      handleEmit(gameState.wsClient, { event: 'prepare', gameId: 1, query: queryDic, data: { board: {data: { speed: gameState.game.board.speed }}} }) // ゲームスピードの選択状態は維持させる
    }
  }

  return {
    pveSelecter,
    setPveSelecter,
    setUserMode,
    gameStart,
  }
}

export { usePveSelecter }