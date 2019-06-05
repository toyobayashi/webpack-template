import { importClass } from 'electron-class-rpc/renderer'

const ApiClass = importClass<typeof CApiClass>('ApiClass')

export default ApiClass
