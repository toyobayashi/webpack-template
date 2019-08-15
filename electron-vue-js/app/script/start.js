const { spawn } = require('child_process')
const { getPath } = require('./util.js')
const config = require('./config.js')

function start () {
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

module.exports = start

if (require.main === module) {
  start()
}
