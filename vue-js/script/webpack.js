const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
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
  if (webpackConfig.output) {
    if (fs.existsSync(webpackConfig.output.path)) fs.removeSync(webpackConfig.output.path)
  }
  const devServerOptions = {
    stats: statsOptions,
    hot: true,
    host: config.devServerHost,
    inline: true,
    contentBase: getPath(config.contentBase),
    before (_app, server) {
      for (let i = 0; i < config.html.length; i++) {
        const item = config.html[i]
        const tpl = typeof item === 'string' ? item : item.template
        server._watch(getPath(tpl))
      }
    }
  }
  if (config.publicPath) devServerOptions.publicPath = config.publicPath
  DevServer.addDevServerEntrypoints(webpackConfig, devServerOptions)
  const server = new DevServer(webpack(webpackConfig), devServerOptions)

  server.listen(config.devServerPort, config.devServerHost, () => {
    if (config.open) require('opn')(`http://${config.devServerHost}:${config.devServerPort}${config.publicPath || '/'}`)
  })
}

function prod () {
  if (webpackConfig.output) {
    if (fs.existsSync(webpackConfig.output.path)) fs.removeSync(webpackConfig.output.path)
  }
  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        console.error(err)
        reject(err)
        return
      }
      console.log(stats.toString(statsOptions) + '\n')
      resolve(stats)
    })
  })
}

module.exports = prod
