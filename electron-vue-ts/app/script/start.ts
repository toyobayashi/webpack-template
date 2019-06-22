import { spawn } from 'child_process'
import { getPath } from './util'
import config from './config'

export default function start () {
  if (config.mode === 'production') {
    const cp = spawn(require('electron'), [
      getPath()
    ], {
      cwd: getPath(),
      stdio: 'inherit'
    })
    return cp
  } else {
    const cp = spawn(require('electron'), [
      '--remote-debugging-port=9222',
      '--inspect=' + Date.now() % 65536,
      getPath()
    ], {
      cwd: getPath(),
      stdio: 'inherit'
    })
    return cp
  }
}

if (require.main === module) {
  start()
}
