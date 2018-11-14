const { spawn } = require('child_process')
const { getPath } = require('./constant')

let cp = spawn(require('electron'), [getPath()])
cp.stdout.pipe(process.stdout)
cp.stderr.pipe(process.stderr)
