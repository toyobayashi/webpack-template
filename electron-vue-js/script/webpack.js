const webpack = require('webpack')
const webpackServe = require('webpack-serve')
const webpackConfig = require('./webpack.config.js')
const config = require('./config.js')

if (process.env.NODE_ENV === 'production') {
  webpack([webpackConfig.mainConfig, webpackConfig.rendererConfig], (err, stats) => {
    if (err) return console.log(err)
    console.log(stats.toString({
      colors: true
    }) + '\n')
  })
} else {
  const mainCompiler = webpack(webpackConfig.mainConfig)
  mainCompiler.watch({
    aggregateTimeout: 200,
    poll: undefined
  }, (err, stats) => {
    if (err) return console.log(err)
    console.log(stats.toString({
      colors: true,
      children: false,
      entrypoints: false,
      modules: false
    }) + '\n')
  })

  webpackServe({
    config: webpackConfig.rendererConfig,
    hot: {
      reload: false,
      port: config.websocketPort,
      validTargets: ['electron-renderer']
    },
    port: config.devServerPort
  })
}
