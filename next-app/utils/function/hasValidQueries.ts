import { ParsedUrlQuery } from 'querystring'

export interface HasValidQueriesArgs {
  query?: ParsedUrlQuery
  target: {
    key: string
    forceString: boolean
    specifyValue?: string | string[]
  }[]
}

/**
 * @param query queryデータ
 * @param target.key 調べるキー名
 * @param target.forceString 同keyで複数値がきた時はstring配列になるためstringで強制するか
 * @param target.specifyValue 特定の値かどうかチェックする場合に指定
 */
const hasValidQueries = (args: HasValidQueriesArgs): args is Required<HasValidQueriesArgs> => {
  const { query, target } = args
  const queryKeys = Object.keys(query ?? {})

  if (typeof query === 'undefined') return false
  if (queryKeys.length === 0) return false
  if (target.length === 0) return false

  for (let i=0; i<target.length; i+=1) {
    const { key, forceString, specifyValue } = target[i]
    if (!queryKeys.includes(key)) return false // target.keyがなければ不正
    if (forceString === Array.isArray(query[key])) return false // 型が不一致であれば不正
    if (specifyValue) {
      if(!hasSameValue(query[key], specifyValue)) return false // 値が不一致であれば不正
    }
  }
  return true  
}

const hasSameValue = (target: string | string[] | undefined, specifyValue:string | string[]) => {
  if (Array.isArray(target) && Array.isArray(specifyValue) ) {
    const test = specifyValue.filter(value => target.includes(value))
    if(test.length === specifyValue.length) return true
  }

  if (typeof target === 'string' && typeof specifyValue === 'string') {
    if (target === specifyValue) return true
  }
  return false
}

export { hasValidQueries }