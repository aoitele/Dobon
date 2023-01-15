export type LoadDobonRedisKeys_RequireFirst = {
  mode: 'pve' | 'pvp'
  type: 'deck' | 'trash'
  firstKey: string
}
export type LoadDobonRedisKeys_RequireSecond = {
  mode: 'pve' | 'pvp'
  type: 'user' | 'hands'
  firstKey: string
  secondKey: string
}

const loadDobonRedisKeys = (args: (LoadDobonRedisKeys_RequireFirst | LoadDobonRedisKeys_RequireSecond)[]) => {
  const response = args.map(arg => {
    switch (arg.type) {
      case 'deck'  :
      case 'trash' : return `${arg.mode}:${arg.firstKey}:${arg.type}`
      case 'user'  : return `${arg.mode}:${arg.firstKey}:${arg.type}:${arg.secondKey}`
      case 'hands' : return `${arg.mode}:${arg.firstKey}:user:${arg.secondKey}:hands`
      default: return ''
    }
  })

  return response
}

export { loadDobonRedisKeys }