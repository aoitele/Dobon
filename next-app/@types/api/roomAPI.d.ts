import { Room } from '../game'
import { User } from '../user'
import { PartiallyRequired } from '../utility'

declare namespace RoomAPIResponse {
  type RoomInfo = Room & { user: User }
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