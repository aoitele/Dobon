/**
 * ログイン判定に利用する共通関数
 * isAuthUserFetching  - 未確定(取得中)かどうか
 * isLoggedIn          - 確定(ログイン)かどうか
 * isNotLoggedIn       - 確定(非ログイン)かどうか
 */
import { AuthState } from '../../context/AuthProvider'

const isAuthUserFetching = (authUser: AuthState['authUser']): authUser is undefined =>
  typeof authUser === 'undefined'
const isLoggedIn = (authUser: AuthState['authUser']): authUser is NonNullable<AuthState['authUser']> =>
  typeof authUser !== 'undefined' && authUser !== null
const isNotLoggedIn = (authUser: AuthState['authUser']): authUser is null => authUser === null

export { isAuthUserFetching, isLoggedIn, isNotLoggedIn }