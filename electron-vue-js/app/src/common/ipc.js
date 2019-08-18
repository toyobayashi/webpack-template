export function parseValue (value) {
  const type = typeof value
  if (type !== 'object') { // primitive
    if (type === 'function' || type === 'symbol') {
      throw new Error(`Type "${type}" not supported.`)
    }
    return {
      type,
      value
    }
  } else if (value === null) { // null
    return {
      type: 'null',
      value: null
    }
  } else {
    if (Array.isArray(value)) { // array
      return {
        type: 'Array',
        value: value.map(v => parseValue(v))
      }
    } else if (Object.prototype.toString.call(value) === '[object Object]') { // object
      const v = {}
      for (const key in value) {
        v[key] = parseValue(value[key])
      }
      return {
        type: 'Object',
        value: v
      }
    } else if (value instanceof Date) {
      return {
        type: 'Date',
        value: value.getTime()
      }
    } else if (value instanceof Error) {
      const keys = Object.getOwnPropertyNames(value)
      const obj = {}
      for (let i = 0; i < keys.length; i++) {
        obj[keys[i]] = parseValue(value[keys[i]])
      }
      return {
        type: 'Error',
        className: value.constructor.name,
        value: obj
      }
    } else {
      return {
        type: 'unknown',
        value: null
      }
    }
  }
}

export function createValue (desc) {
  switch (desc.type) {
    case 'Object':
      const res = {}
      for (const key in desc.value) {
        res[key] = createValue(desc.value[key])
      }
      return res
    case 'Array':
      return desc.value.map((v) => createValue(v))
    case 'Error':
      // tslint:disable-next-line: strict-type-predicates
      const g = typeof window === 'undefined' ? global : window
      const err = g[desc.className] ? new g[desc.className]() : new Error()
      for (const key in desc.value) {
        err[key] = createValue(desc.value[key])
      }
      return err
    case 'Date':
      return new Date(desc.value)
    case 'undefined':
      return undefined
    default:
      return desc.value
  }
}
