import { spawn } from 'child_process'
import { getPath } from './constant'

let cp = spawn(require('electron'), [getPath()])
cp.stdout.pipe(process.stdout)
cp.stderr.pipe(process.stderr)
