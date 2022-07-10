import React, { createContext, useEffect, Dispatch, useReducer } from 'react'
import { isAuthUserFetching } from '../utils/auth/authState'
import loginWithToken from '../utils/auth/loginWithToken'
import hasProperty from '../utils/function/hasProperty'

/**
 **
 * AuthAPIResponse.User: APIコールの結果、ログインの場合 Userオブジェクトが返る
 * null: APIコールの結果、未ログインの場合 nullが返る
 * undifined: APIコールが返る前
 *
 * 利用するコンポーネントで型参照ができるよう、type AuthState/AuthDispatchをexport
 */

export type AuthState = {
  authUser: AuthAPIResponse.UserMe | null | undefined
}

type Action =
  | {
      type: 'CREATE'
      authUser: AuthAPIResponse.UserMe | null | undefined
    }
  | { type: 'REMOVE' }

export type AuthDispatch = Dispatch<Action> | undefined

/**
 **
 * Context生成
 * 取得用(AuthStateContext)
 * 更新用(AuthDispatchContext)
 */
const AuthStateContext = createContext<AuthState>({
  authUser: undefined,
})
const AuthDispatchContext = createContext<AuthDispatch>(undefined)

/**
 * Reducer
 */
const authReducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'CREATE':
      return { authUser: action.authUser }
    case 'REMOVE':
      return { authUser: null }
    default:
      throw new Error('Invalid reducer action')
  }
}

const authUserInitialState = {
  authUser: undefined,
}

const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, authUserInitialState)

  useEffect(() => {
    if (!isAuthUserFetching(state.authUser)) return

    const userChk = async () => {
      try {
        const userInfo = await loginWithToken()

        if (userInfo.result && hasProperty(userInfo, 'data')) {
          dispatch({ type: 'CREATE', authUser: userInfo.data })
        } else {
          dispatch({ type: 'CREATE', authUser: null })
        }
      } catch (err) {
        dispatch({ type: 'CREATE', authUser: null })
      }
    }
    userChk()
  }, [state])

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  )
}

export { AuthStateContext, AuthDispatchContext, AuthProvider, authUserInitialState }
