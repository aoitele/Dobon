export const nonNullable = <T>(args: T[]): args is NonNullable<T>[] => {
  for (const arg of args) {
    if (arg == null) return false
  }
  return true
}