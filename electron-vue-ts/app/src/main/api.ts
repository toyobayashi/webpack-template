import { exportClass } from 'electron-class-rpc/main'

class ApiClass {
  static getTypeSync () {
    return process.type
  }
}

export default function () {
  exportClass('ApiClass', ApiClass)
}
