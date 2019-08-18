// electron v7 ipc handle/invoke

import { ipcRenderer } from 'electron'
import { parseValue, createValue } from '@/common/ipc'

const generateObjectId = (function () {
  let processUnique = ''
  for (let i = 0; i < 5; i++) {
    processUnique += toHex(Math.floor(Math.random() * 256))
  }
  let index = ~~(Math.random() * 0xffffff)

  function toHex (num) {
    const hex = num.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  function generateObjectId () {
    const time = ~~(Date.now() / 1000)
    let timeString = ''
    let indexString = ''
    timeString += toHex((time >> 24) & 0xff)
    timeString += toHex((time >> 16) & 0xff)
    timeString += toHex((time >> 8) & 0xff)
    timeString += toHex((time) & 0xff)

    indexString += toHex((index >> 16) & 0xff)
    indexString += toHex((index >> 8) & 0xff)
    indexString += toHex((index) & 0xff)
    index++
    return timeString + processUnique + indexString
  }

  generateObjectId.isObjectId = function (str) {
    return /^[0123456789abcdef]{24}$/.test(str)
  }

  return generateObjectId
})()

const _invokeResults = new Map()

ipcRenderer.invoke = ipcRenderer.invoke || function (method, ...args) {
  return new Promise((resolve, reject) => {
    const id = generateObjectId()
    _invokeResults.set(id, { resolve, reject })
    ipcRenderer.send('__ipc_invoke__', id, method, ...(args.map(v => parseValue(v))))
  })
}

ipcRenderer.on('__ipc_invoked__', (_event, oid, err, result) => {
  const defer = _invokeResults.get(oid)
  if (createValue(err)) {
    defer.reject(createValue(err))
  } else {
    defer.resolve(createValue(result))
  }
  defer.reject = null
  defer.resolve = null
  _invokeResults.delete(oid)
})
