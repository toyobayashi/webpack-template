declare interface Window {
  preload: {
    electronClassRpc: typeof import('electron-class-rpc/renderer')
    electron: {
      version: string
    }
  }
}
