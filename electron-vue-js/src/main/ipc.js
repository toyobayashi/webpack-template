import '@tybys/electron-ipc-handle-invoke/main.js'
import { ipcMain } from 'electron'

export default function init () {
  ipcMain.handle('showArgs', (_e, ...args) => {
    console.log(args)
    return args
  })
}
