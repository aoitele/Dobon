export const nonNullable = <T>(args: T[]): args is NonNullable<T>[] => {
  for (const arg of args) {
    if (arg === null || typeof arg === 'undefined') return false
  }
  return true
}

export function exists<T>(arg: T | null | undefined): arg is NonNullable<T> {
  return typeof arg !== 'undefined' && arg !== null
}

export function assertExists<T>(arg: T | null | undefined, target = ''): asserts arg is NonNullable<T> {
  // console.log(arg, 'arg')
  if (!exists(arg)) {
    throw new Error(`${target} should be sprcified`.trim());
  }
}