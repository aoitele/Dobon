import { EmitBoard, Emit } from '../../@types/socket'
import { Board } from '../../@types/game'

export type CpuTurnEmitData = {
  type: 'board'
  data: Board
}