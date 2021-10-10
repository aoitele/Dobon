const isObjectType = (arg: any) => typeof arg === 'object' && !Array.isArray(arg) && arg !== null 

export { isObjectType }