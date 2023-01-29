import { EmitCard, EmitAction, EmitBoard } from '../../@types/socket'
import hasProperty from './hasProperty'

const useEmitDataType = (arg: unknown) =>
  hasProperty(arg, 'type') ? arg.type : false

const isEmitBoard = (arg: unknown): arg is EmitBoard =>
  useEmitDataType(arg) === 'board'
const isEmitCard = (arg: unknown): arg is EmitCard =>
  useEmitDataType(arg) === 'card'
const isEmitAction = (arg: unknown): arg is EmitAction =>
  useEmitDataType(arg) === 'action'

export { isEmitBoard, isEmitCard, isEmitAction }
