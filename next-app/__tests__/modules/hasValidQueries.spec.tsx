import { hasValidQueries, HasValidQueriesArgs as Args } from '../../utils/function/hasValidQueries'

const QUERY_EMPTY: Args['query']                              = {}
const QUERY_ONE_VALUE: Args['query']                          = { name: 'suzuki' }
const QUERY_ONE_VALUE_AGE: Args['query']                      = { age: '20' }
const QUERY_ONE_VALUE_ARRAY: Args['query']                    = { name: ['suzuki', 'tanaka'] }
const QUERY_MULTI_VALUE: Args['query']                        = { name: 'suzuki', age: '20' }

const TARGET_EMPTY: Args['target']                            = []
const TARGET_ONE: Args['target']                              = [{ key: 'name', forceString: true }]
const TARGET_ONE_SPECIFY: Args['target']                      = [{ key: 'name', forceString: true, specifyValue: 'suzuki' }]
const TARGET_ONE_SPECIFY_ARRAY: Args['target']                = [{ key: 'name', forceString: false, specifyValue: ['suzuki', 'tanaka'] }]
const TARGET_ONE_SPECIFY_ARRAY_INCORRECT_NAME: Args['target'] = [{ key: 'name', forceString: false, specifyValue: ['suzuki', 'tana'] }]
const TARGET_ONE_SPECIFY_INCORRECT_NAME: Args['target']       = [{ key: 'name', forceString: true, specifyValue: 'suzu' }]
const TARGET_MULTI: Args['target']                            = [{ key: 'name', forceString: true }, { key: 'age', forceString: true }]
const TARGET_MULTI_NAME_VALUE_ARRAY: Args['target']           = [{ key: 'name', forceString: false }, { key: 'age', forceString: true }]

describe('unit: hasValidQueries TestCases', () => {
  describe.each`
    query                     | target                                     | expected
    /* 正常系 */
    ${QUERY_ONE_VALUE}        | ${TARGET_ONE}                              | ${true}   nameがある
    ${QUERY_ONE_VALUE}        | ${TARGET_ONE_SPECIFY}                      | ${true}   nameの値が正しい
    ${QUERY_ONE_VALUE_ARRAY}  | ${TARGET_ONE_SPECIFY_ARRAY}                | ${true}   nameの値が正しい(Array版)
    ${QUERY_MULTI_VALUE}      | ${TARGET_MULTI}                            | ${true}   name、ageともにある
    /* 異常系 */
    ${QUERY_ONE_VALUE_AGE}    | ${TARGET_ONE}                              | ${false}  nameがない
    ${QUERY_ONE_VALUE}        | ${TARGET_ONE_SPECIFY_INCORRECT_NAME}       | ${false}  nameの値が不正
    ${QUERY_ONE_VALUE_ARRAY}  | ${TARGET_ONE_SPECIFY_ARRAY_INCORRECT_NAME} | ${false}  nameの値が不正(Array版)
    ${QUERY_ONE_VALUE}        | ${TARGET_MULTI}                            | ${false}  ageがない
    ${QUERY_MULTI_VALUE}      | ${TARGET_MULTI_NAME_VALUE_ARRAY}           | ${false}  name、ageともにあるが型が不正
    ${QUERY_ONE_VALUE}        | ${TARGET_EMPTY}                            | ${false}  targetが与えられていない
    ${QUERY_EMPTY}            | ${TARGET_ONE}                              | ${false}  queryが与えられていない
  `('$hasValidQueries should be', ({ query, target, expected }) => {
    test(`query:${JSON.stringify(query)} target: ${JSON.stringify(target)} - returns ${expected}`, () => {
      expect(hasValidQueries({query, target})).toBe(expected)
    })
  })
})

 