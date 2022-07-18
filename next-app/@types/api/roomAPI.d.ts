import { Room } from '../game'
import { User } from '../user'
import { PartiallyRequired } from '../utility'

export interface RoomAPIResponse {
  roomInfo: Room & { user: User }
  rooms : Pick<Room, 'id' | 'title' | 'max_seat' | 'set_count' | 'rate' | 'create_user_id' | 'status'> & { user: Pick<User, 'nickname'> }
}

export type RoomCreateForm = Pick<
Room,
'create_user_id'
|'invitation_code'
|'max_seat'
|'rate'
|'set_count'
|'status'
|'title'
>

export interface RoomCreateResponse {
  result: boolean
  data: RoomCreateForm
}