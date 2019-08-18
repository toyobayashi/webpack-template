// electron v7 ipc handle/invoke

import { ipcMain } from 'electron'
import { parseValue, createValue } from '@/common/ipc'

const _invokeHandlers = new Map()

ipcMain.handle = ipcMain.handle || function (method, fn) {
  if (_invokeHandlers.has(method)) {
    throw new Error(`Attempted to register a second handler for '${method}'`)
  }
  // tslint:disable-next-line: strict-type-predicates
  if (typeof fn !== 'function') {
    throw new Error(`Expected handler to be a function, but found type '${typeof fn}'`)
  }

  _invokeHandlers.set(method, async (e, oid, ...args) => {
    try {
      e.sender.send('__ipc_invoked__', oid, parseValue(null), parseValue(await Promise.resolve(fn(e, ...(args.map(v => createValue(v)))))))
    } catch (err) {
      e.sender.send('__ipc_invoked__', oid, parseValue(err), parseValue(undefined))
    }
  })
}

ipcMain.removeHandler = ipcMain.removeHandler || function (method) {
  _invokeHandlers.delete(method)
}

ipcMain.handleOnce = ipcMain.handleOnce || function (method, fn) {
  ipcMain.handle(method, (e, ...args) => {
    ipcMain.removeHandler(method)
    return fn(e, ...args)
  })
}

ipcMain.on('__ipc_invoke__', function (event, oid, method, ...args) {
  if (_invokeHandlers.has(method)) {
    _invokeHandlers.get(method)(event, oid, ...args)
  } else {
    event.sender.send('__ipc_invoked__', oid, parseValue(new Error(`No handler registered for '${method}'`)), parseValue(undefined))
  }
})
