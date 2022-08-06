import router from 'next/router'
import { destroyCookie } from 'nookies'

const logout = (path?: string) => {
  const redirectParth = path || '/'
  destroyCookie(null, 'accesstoken')
  router.push(redirectParth)
  router.reload()
}

export default logout