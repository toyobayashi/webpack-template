import * as electronClassRpc from 'electron-class-rpc/renderer'

process.on('loaded', function () {
  window.preload = {
    electronClassRpc
  }
  window.process = {
    versions: process.versions
  }
})
