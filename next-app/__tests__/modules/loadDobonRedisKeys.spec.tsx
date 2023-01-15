import {
  loadDobonRedisKeys,
  LoadDobonRedisKeys_RequireFirst as ReqF,
  LoadDobonRedisKeys_RequireSecond as ReqS
} from '../../server/redis/loadDobonRedisKeys'

const REQ_DECK:ReqF     = { mode: 'pve', type: 'deck', firstKey: 'key-1' }
const REQ_TRASH:ReqF    = { mode: 'pve', type: 'trash', firstKey: 'key-1' }
const REQ_USER:ReqS     = { mode: 'pve', type: 'user', firstKey: 'key-1', secondKey: 'key-2' }
const REQ_HANDS:ReqS    = { mode: 'pve', type: 'hands', firstKey: 'key-1', secondKey: 'key-2' }
const REQ_DECK_PVP:ReqF = { mode: 'pvp', type: 'deck', firstKey: 'key-1' }
const REQ_USER_PVP:ReqS = { mode: 'pvp', type: 'user', firstKey: 'key-1', secondKey: 'key-2' }

const EXPECTED_DECK     = 'pve:key-1:deck'
const EXPECTED_TRASH    = 'pve:key-1:trash'
const EXPECTED_USER     = 'pve:key-1:user:key-2'
const EXPECTED_HANDS    = 'pve:key-1:user:key-2:hands'
const EXPECTED_DECK_PVP = 'pvp:key-1:deck'
const EXPECTED_USER_PVP = 'pvp:key-1:user:key-2'

describe('unit: loadDobonRedisKeys TestCases', () => {
  describe.each`
    args                        | expected
    /* 正常系 */
    ${[REQ_DECK]}               | ${[EXPECTED_DECK]}
    ${[REQ_TRASH]}              | ${[EXPECTED_TRASH]}
    ${[REQ_USER]}               | ${[EXPECTED_USER]}
    ${[REQ_HANDS]}              | ${[EXPECTED_HANDS]}
    ${[REQ_DECK_PVP]}           | ${[EXPECTED_DECK_PVP]}
    ${[REQ_USER_PVP]}           | ${[EXPECTED_USER_PVP]}
    ${[REQ_DECK, REQ_TRASH]}    | ${[EXPECTED_DECK, EXPECTED_TRASH]}
    ${[REQ_DECK, REQ_USER]}     | ${[EXPECTED_DECK, EXPECTED_USER]}
    ${[REQ_DECK, REQ_USER_PVP]} | ${[EXPECTED_DECK, EXPECTED_USER_PVP]}
  `('$loadDobonRedisKeys should be', ({ args, expected }) => {
    test(`args:${JSON.stringify(args)} - returns ${expected}`, () => {
      expect(loadDobonRedisKeys(args)).toEqual(expected)
    })
  })
})

 