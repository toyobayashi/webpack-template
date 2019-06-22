declare interface Window {
  preload: {
    electronClassRpc: typeof import('electron-class-rpc/renderer')
  }
  process: {
    versions: typeof process.versions
  }
}
