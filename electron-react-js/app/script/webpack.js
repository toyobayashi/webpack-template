const webpack = require('webpack')
const { mainConfig, rendererConfig } = require('./webpack.config.js')
const { config, getPath } = require('./constant.js')
const DevServer = require('webpack-dev-server')
const fs = require('fs-extra')

const statsOptions = {
  colors: true,
  children: false,
  modules: false,
  entrypoints: false
}

if (require.main === module) {
  main()
}

function main () {
  if (process.env.NODE_ENV === 'production') return prod()
  if (rendererConfig.output) {
    if (fs.existsSync(rendererConfig.output.path)) fs.removeSync(rendererConfig.output.path)
  }
  const mainCompiler = webpack(mainConfig)
  mainCompiler.watch({
    aggregateTimeout: 200,
    poll: undefined
  }, (err, stats) => console.log(err || (stats.toString(statsOptions) + '\n')))

  const devServerOptions = {
    stats: statsOptions,
    hot: true,
    host: config.devServerHost,
    inline: true,
    contentBase: getPath(config.contentBase)
  }
  if (config.publicPath) devServerOptions.publicPath = config.publicPath

  DevServer.addDevServerEntrypoints(rendererConfig, devServerOptions)
  const server = new DevServer(webpack(rendererConfig), devServerOptions)

  server.listen(config.devServerPort, config.devServerHost, (err) => {
    if (err) console.log(err)
  })
}

function prod () {
  if (rendererConfig.output) {
    if (fs.existsSync(rendererConfig.output.path)) fs.removeSync(rendererConfig.output.path)
  }
  const webpackPromise = (option) => new Promise((resolve, reject) => {
    webpack(option, (err, stats) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      console.log(stats.toString(statsOptions) + '\n')
      resolve()
    })
  })

  return Promise.all([
    webpackPromise(mainConfig),
    webpackPromise(rendererConfig)
  ])
}

module.exports = prod
