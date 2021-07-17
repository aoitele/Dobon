const hasProperty = (obj: any, key: string): boolean => Boolean(obj) && Object.prototype.hasOwnProperty.call(obj, key)
  export default hasProperty
  