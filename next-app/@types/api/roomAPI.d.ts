import { Room } from '../game'
import { User } from '../user'

declare namespace RoomAPIResponse { // eslint-disable-line no-unused-vars
    type RoomInfo = Room & { user: User } // eslint-disable-line no-unused-vars
}