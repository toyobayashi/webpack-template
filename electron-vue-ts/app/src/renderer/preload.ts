import * as electronClassRpc from 'electron-class-rpc/renderer'

window.electronClassRpc = electronClassRpc
window.electron = {
  version: process.versions.electron
}

console.log('preload: ' + process.type)
