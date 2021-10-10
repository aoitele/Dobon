function hasProperty<K extends string>(x: unknown, ...keys: K[]): x is { [M in K]: unknown } { // eslint-disable-line
  return x instanceof Object && keys.every(key => key in x)
}

export default hasProperty