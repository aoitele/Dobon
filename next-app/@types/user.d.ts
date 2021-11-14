export type User = {
  id: number
  nickname: string
  status: number
  invitation_code: string
  expired_date: Date
  last_login: Date
  created: Date
  modified: Date
}

export type GameUserInfo = {
  id: number
  nickname: string
  score: number
  turn: number
}
