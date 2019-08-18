const { getPath } = require('./util.js')
const { execSync } = require('child_process')
const pkg = require('../package.json')
const { existsSync } = require('fs')
const config = require('./config.js')
const chalk = require('chalk')

const arch = process.argv.slice(2)[0]

// tslint:disable-next-line: strict-type-predicates
const author = typeof pkg.author === 'object' ? pkg.author.name : pkg.author

// interface ProductionPackage {
//   name: string
//   version: string
//   main: string
//   author: string
//   license: string
//   dependencies?: { [module: string]: string }
//   _commit?: string
//   _commitDate?: string
// }

const productionPackage = {
  name: pkg.name,
  version: pkg.version,
  main: pkg.main,
  author,
  license: pkg.license
}

if (pkg.dependencies) {
  productionPackage.dependencies = pkg.dependencies
}

try {
  productionPackage._commit = execSync('git rev-parse HEAD').toString().replace(/[\r\n]/g, '')
  productionPackage._commitDate = new Date((execSync('git log -1').toString().match(/Date:\s*(.*?)\n/))[1]).toISOString()
} catch (err) {
  console.log(chalk.yellowBright('\n  [WARN] Not a git repository.\n'))
}

const packagerOptions = {
  dir: getPath(),
  out: getPath(config.distPath),
  arch,
  // ignore: /node_modules|res|src|script|README|tslint\.json|tsconfig|package-lock\.json|\.git|\.vscode|\.npmrc/,
  prebuiltAsar: getPath(config.distPath, 'resources/app.asar'),
  appCopyright: `Copyright (C) ${new Date().getFullYear()} ${productionPackage.author}`,
  overwrite: true
}

if (process.env.npm_config_electron_mirror && process.env.npm_config_electron_mirror.indexOf('taobao') !== -1) {
  packagerOptions.download = {
    unsafelyDisableChecksums: true,
    mirrorOptions: {
      mirror: process.env.npm_config_electron_mirror.endsWith('/') ? process.env.npm_config_electron_mirror : (process.env.npm_config_electron_mirror + '/'),
      customDir: pkg.devDependencies.electron
    }
  }
}

if (process.platform === 'win32') {
  const iconPath = getPath(config.iconSrcDir, 'app.ico')
  if (existsSync(iconPath)) {
    packagerOptions.icon = iconPath
  }
} else if (process.platform === 'darwin') {
  const iconPath = getPath(config.iconSrcDir, 'app.icns')
  if (existsSync(iconPath)) {
    packagerOptions.icon = iconPath
  }
}

module.exports = { arch, productionPackage, packagerOptions }
