import { Room } from '../game'
import { User } from '../user'

declare namespace RoomAPIResponse {
  type RoomInfo = Room & { user: User }
}
