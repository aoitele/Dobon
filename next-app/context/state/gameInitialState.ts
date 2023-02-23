import { GameProviderState } from "../GameProvider";

const gameInitialState: GameProviderState = {
  roomId: null,
  userId: null,
  game: {
    id: null,
    setCount: null,
    status: undefined,
    event: {
      user: [],
      action: null,
      message: null
    },
    board: {
      users: [],
      deckCount: 0,
      hands: [],
      trash: {
        card: '',
        user: {
          id: 0,
          nickname: '',
          turn: 0,
          score: 0,
          isWinner: false,
          isLoser: false
        }
      },
      otherHands: [],
      turn: null,
      effect: [],
      allowDobon: true,
      waitDobon: false,
      bonusCards: []
    },
    result: {},
  },
  connected: false,
  wsClient: null
}

export { gameInitialState }