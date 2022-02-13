import { ModalEffect } from "../../@types/game"
import { Event } from '../../@types/socket'

const modalEvents: ModalEffect['action'][] = [
  'avoidEffect',
  'notAvoidEffect',
  'skip',
  'draw',
  'draw2',
  'draw4',
  'draw6',
  'draw8',
  'wild',
  'reverse',
  'opencard',
  'dobon',
  'dobonsuccess',
  'dobonfailure'
]

const isModalEvent = (event: Event) => event !== null && modalEvents.includes(event)

export { modalEvents, isModalEvent }