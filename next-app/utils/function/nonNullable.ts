export const nonNullable = <T>(args: T[]): args is NonNullable<T>[] => {
  for (const arg of args) {
    if (arg === null || typeof arg === 'undefined') return false
  }
  return true
}