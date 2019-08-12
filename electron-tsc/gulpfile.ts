import { src, dest, watch, series, parallel } from 'gulp'
import * as path from 'path'
import * as fs from 'fs-extra'
import { spawn } from 'child_process'

import { createProject } from 'gulp-typescript'
import * as htmlmin from 'gulp-htmlmin'
import terser = require('gulp-terser')
const cssnano = require('gulp-cssnano')

const getPath = (...args: string[]) => path.join(__dirname, ...args)

const isProductionMode = process.env.NODE_ENV === 'production'

const tsconfigPath = getPath(`tsconfig.${isProductionMode ? 'prod' : 'dev'}.json`)
const tsconfig = fs.readJSONSync(tsconfigPath)

const tsProject = createProject(tsconfigPath)

export function clean () {
  return fs.remove(getPath(tsconfig.compilerOptions.outDir))
}

function ts () {
  return (
    src(['src/**/*.ts', 'src/**/*.tsx'])
      .pipe(tsProject())
      .pipe(terser())
      .pipe(dest(getPath(tsconfig.compilerOptions.outDir)))
  )
}

function tscw () {
  return spawn(process.platform === 'win32' ? getPath('node_modules/.bin/tsc.cmd') : getPath('node_modules/.bin/tsc'), ['-w', '-p', tsconfigPath], { cwd: getPath(), stdio: 'inherit' })
}

function html () {
  if (isProductionMode) {
    return (
      src('src/**/*.html')
        .pipe(htmlmin({
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          collapseBooleanAttributes: true,
          removeScriptTypeAttributes: true
        }))
        .pipe(dest(getPath(tsconfig.compilerOptions.outDir)))
    )
  } else {
    return (
      src('src/**/*.html')
        .pipe(dest(getPath(tsconfig.compilerOptions.outDir)))
    )
  }
}

function css () {
  if (isProductionMode) {
    return (
      src('src/**/*.css')
        .pipe(cssnano())
        .pipe(dest(getPath(tsconfig.compilerOptions.outDir)))
    )
  } else {
    return (
      src('src/**/*.css')
        .pipe(dest(getPath(tsconfig.compilerOptions.outDir)))
    )
  }
}

export function dev () {
  return clean().then(() => {
    watch('src/**/*.html', { ignoreInitial: false }, html)
    watch('src/**/*.css', { ignoreInitial: false }, css)

    return new Promise<void>(resolve => {
      tscw().once('exit', resolve)
    })
  })
}

export function build (done) {
  return series(clean, parallel(html, css, ts))(done)
}
