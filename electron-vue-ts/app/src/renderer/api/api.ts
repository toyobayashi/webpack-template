const { importClass } = window.preload.electronClassRpc

const ApiClass = importClass<typeof CApiClass>('ApiClass')

export default ApiClass
