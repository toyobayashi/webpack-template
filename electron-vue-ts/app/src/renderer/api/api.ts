const { importClass } = window.electronClassRpc

const ApiClass = importClass<typeof CApiClass>('ApiClass')

export default ApiClass
