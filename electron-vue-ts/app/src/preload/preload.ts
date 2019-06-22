/// <reference path="../../node_modules/electron/electron.d.ts" />

import * as electronClassRpc from 'electron-class-rpc/renderer'

process.once('loaded', function () {
  window.preload = {
    electronClassRpc
  }
  window.process = {
    versions: process.versions
  }
})
