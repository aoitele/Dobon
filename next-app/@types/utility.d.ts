// 指定したプロパティのみ任意にする
export type PartiallyPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

// 指定したプロパティのみ必須にする
export type PartiallyRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

// ネストされた型まで任意にする
export type NestedPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer R>
    ? Array<NestedPartial<R>>
    : NestedPartial<T[K]>
}
