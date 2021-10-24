import React, { createContext, useEffect, Dispatch, useReducer } from 'react'
import loginWithToken from '../utils/auth/loginWithToken'
import hasProperty from "../utils/function/hasProperty"

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
    fetched?: boolean
}

type Action = 
  | {
      type: 'CREATE';
      authUser: AuthAPIResponse.UserMe | null | undefined
      fetched: boolean
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
    fetched: false,
})
const AuthDispatchContext = createContext<AuthDispatch>(undefined)

/**
 * Reducer
 */
const authReducer = (state:AuthState, action:Action): AuthState => {
  switch(action.type) {
    case 'CREATE':
      return { authUser:action.authUser, fetched: action.fetched }
      case 'REMOVE':
        return { authUser: null }
      default :
        throw new Error('Invalid reducer action')
  }
}

const initialState = {
  authUser: undefined,
  fetched: false
}

const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    if (!state.fetched) {	
      const userChk = async() => {	
        try {
          const userInfo = await loginWithToken()		
          if (userInfo.result && hasProperty(userInfo, 'data')) {				
            dispatch({ type: 'CREATE', authUser: userInfo.data, fetched: true })
          }
        } catch(err) {
          dispatch({ type: 'CREATE', authUser: null, fetched: true })		
        }
      }
      userChk()
    }
  }, [state.fetched])
  
  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>{children}</AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  )
}

export { AuthStateContext, AuthDispatchContext, AuthProvider }