const path = require('path')
const fs = require('fs-extra')
const { spawn } = require('child_process')
const Terser = require('terser')
const cssnano = require('cssnano')
const { minify } = require('html-minifier')

const outDir = getPath(require('../tsconfig.prod.json').compilerOptions.outDir)

function getPath (...relative) {
  return path.join(__dirname, '..', ...relative)
}

function walk (dir, callback) {
  const ls = fs.readdirSync(dir)
  for (let i = 0; i < ls.length; i++) {
    const p = path.join(dir, ls[i])
    if (fs.statSync(p).isDirectory()) {
      walk(p, callback)
    } else {
      callback(p)
    }
  }
}

function main () {
  if (fs.existsSync(outDir)) {
    fs.removeSync(outDir)
  }

  const cp = spawn(process.platform === 'win32' ? getPath('node_modules/.bin/tsc.cmd') : getPath('node_modules/.bin/tsc'), ['-p', getPath('tsconfig.prod.json')], { cwd: getPath(), stdio: 'inherit' })
  cp.on('exit', function (code, signal) {
    walk(getPath('src'), function (p) {
      const ext = path.extname(p)
      const target = path.join(outDir, path.relative(getPath('src'), p))
      fs.mkdirsSync(path.dirname(target))
      if (ext === '.html') {
        fs.writeFileSync(target, minify(fs.readFileSync(p, 'utf8'), {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          collapseBooleanAttributes: true,
          removeScriptTypeAttributes: true
        }), 'utf8')
      } else if (ext === '.css') {
        cssnano.process(fs.readFileSync(p, 'utf8'), { from: undefined }, { preset: 'default'}).then(res => {
          fs.writeFileSync(target, res.css, 'utf8')
        })
      }
    })
    const outJs = []
    walk(outDir, function (file) {
      console.log(file)
      if (path.extname(file) === '.js') {
        const result = Terser.minify(fs.readFileSync(file, 'utf8'))
        outJs.push({
          path: file,
          code: result.code,
          error: result.error
        })
      } else if (path.extname(file) === '.html') {
        outJs.push({
          path: file,
          code: fs.readFileSync(file, 'utf8'),
          error: undefined
        })
      }
    })

    let error
    for (let i = 0; i < outJs.length; i++) {
      if (outJs[i].error) {
        error = outJsp[i].error
        break
      }
    }

    if (!error) {
      for (let i = 0; i < outJs.length; i++) {
        fs.writeFileSync(outJs[i].path, outJs[i].code, 'utf8')
      }
    } else {
      console.error(error)
      process.exit(1)
    }
  })
}

if (require.main === module) {
  main()
}
