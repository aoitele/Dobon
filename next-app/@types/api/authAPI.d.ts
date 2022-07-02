declare namespace AuthAPIResponse {
  type UserMe = {
    id: number
    nickname: string
    status: number
    expired_date: Date | null
    last_login: Date | null
    created_at?: Date | null
    updated_at?: Date | null
    create_room_id: number[]
    participate_room_id: number[]
  }
}
