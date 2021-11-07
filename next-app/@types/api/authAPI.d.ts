declare namespace AuthAPIResponse {
  type UserMe = {
    id: number
    nickname: string
    status: number
    expired_date: Date
    last_login: Date
    created_at: Date
    updated_at: Date
    create_room_id: number[]
    participate_room_id: number[]
  }
}
