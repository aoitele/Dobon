// Context関連のモックデータを返す
import { authStateMockInit, userNotLogedIn, userLogedIn } from './authUser'
import { authUserInitialState } from '../../../context/authProvider'

type AuthStateMockRequest = 
'authStateMockInit' |
'userNotLogedIn' |
'userLogedIn'

const authStateMock = (req: AuthStateMockRequest) => {
  switch (req) {
    case 'authStateMockInit'    : return authStateMockInit
    case 'userNotLogedIn'       : return userNotLogedIn
    case 'userLogedIn'          : return userLogedIn
    default                     : return { ...authUserInitialState }
  }
}

export default authStateMock