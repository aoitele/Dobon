/**
 * Context関連のユーザーパターン定義 (テスト用)
 */
import deepcopy from 'deepcopy';
import { AuthState } from "../../../context/authProvider";

/**
* authUserのデータパターン　
*/
const authUserMock__Normal: AuthAPIResponse.UserMe = {
  create_room_id: [],
  expired_date: null,
  id: 1,
  last_login: null,
  nickname: "たろう",
  participate_room_id: [],
  status: 1,
}


/**
* ログイン状態別にモックデータを返す
*/
const authStateMockInit: AuthState = {
  authUser: undefined,
}

const userNotLogedIn: AuthState = {
  authUser: null,
}

const userLogedIn: AuthState = {
  authUser: deepcopy(Object.assign(authUserMock__Normal)),
}
 
export { 
  authStateMockInit,
  userNotLogedIn,
  userLogedIn,
}