interface hasSpecifyKeyObj {
  [x: string]: any;
}

const hasProperty = (arg: unknown, key: string): arg is hasSpecifyKeyObj => {
  if (typeof arg ==='object' && arg !== null) {
    return Boolean(arg) && Object.prototype.hasOwnProperty.call(arg, key)
  }
  return false
}

export default hasProperty