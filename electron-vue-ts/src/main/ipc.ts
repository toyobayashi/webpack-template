import '@tybys/electron-ipc-handle-invoke/main'
import { ipcMain } from 'electron'

export default function init (): void {
  ipcMain.handle('showArgs', (_e, ...args) => {
    console.log(args)
    return args
  })
}
