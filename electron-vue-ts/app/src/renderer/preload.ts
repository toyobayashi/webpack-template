import * as electronClassRpc from 'electron-class-rpc/renderer'

window.preload = {
  electronClassRpc,
  electron: {
    version: process.versions.electron
  }
}

console.log('preload: ' + process.type)
