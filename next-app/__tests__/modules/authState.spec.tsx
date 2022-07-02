import { isAuthUserFetching, isLoggedIn, isNotLoggedIn } from '../../utils/auth/authState'
import authStateMock from '../__mocks__/context/index'

/**
 * 検証するユーザーパターン
 *
 * INITIAL_AUTH_STATE  - authState未確定(undefined)
 * NOT_LOGEDIN_USER    - 非ログイン(null)
 * LOGEDIN_USER_IPPAN  - ログイン(一般ユーザー)
 */
const INITIAL_AUTH_STATE = authStateMock('authStateMockInit')['authUser']
const NOT_LOGEDIN_USER = authStateMock('userNotLogedIn')['authUser']
const LOGEDIN_USER = authStateMock('userLogedIn')['authUser']

describe.each`
       authUser        |       callfn           |  expected
${INITIAL_AUTH_STATE}  | ${isAuthUserFetching}  | ${true}
${INITIAL_AUTH_STATE}  | ${isLoggedIn}          | ${false}
${INITIAL_AUTH_STATE}  | ${isNotLoggedIn}       | ${false}

${NOT_LOGEDIN_USER}    | ${isAuthUserFetching}  | ${false}
${NOT_LOGEDIN_USER}    | ${isLoggedIn}          | ${false}
${NOT_LOGEDIN_USER}    | ${isNotLoggedIn}       | ${true}

${LOGEDIN_USER}  | ${isAuthUserFetching}  | ${false}
${LOGEDIN_USER}  | ${isLoggedIn}          | ${true}
${LOGEDIN_USER}  | ${isNotLoggedIn}       | ${false}
`('authUser:$authUser $callfn -> $expected', ({ authUser, callfn, expected }) => {
  test(`returns ${expected}`, () => {
    expect(callfn(authUser)).toBe(expected)
  })
})
