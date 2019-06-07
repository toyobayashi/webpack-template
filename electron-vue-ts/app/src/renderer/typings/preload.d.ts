declare interface Window {
  electronClassRpc: typeof import('electron-class-rpc/renderer')
  electron: {
    version: string
  }
}
