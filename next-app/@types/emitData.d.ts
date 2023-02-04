import { EmitBoard, Emit } from './socket'
import { Board } from './game'

export type CpuTurnEmitData = {
  type: 'board'
  data: Board
}