const fs = require('fs-extra')
const chokidar = require('chokidar')
const path = require('path')
const { spawn } = require('child_process')

const outDir = getPath(require('../tsconfig.dev.json').compilerOptions.outDir)

function getPath (...relative) {
  return path.join(__dirname, '..', ...relative)
}

function main () {
  const watcher = chokidar.watch(['src/**/*.html', 'src/**/*.css'])
  watcher.on('all', function (eventName, p, stats) {
    console.log(`[${eventName}]: ${p}`)
    const target = path.join(outDir, path.relative(getPath('src'), p))
    if (eventName === 'add' || eventName === 'change' || eventName === 'addDir') {
      fs.mkdirsSync(path.dirname(target))
      fs.copySync(p, target)
    } else {
      fs.removeSync(target)
    }
  })
  spawn(process.platform === 'win32' ? getPath('node_modules/.bin/tsc.cmd') : getPath('node_modules/.bin/tsc'), ['-w', '-p', getPath('tsconfig.dev.json')], { cwd: getPath(), stdio: 'inherit' })
}

if (require.main === module) {
  main()
}
