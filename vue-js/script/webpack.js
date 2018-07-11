const webpack = require('webpack')
const webpackServe = require('webpack-serve')
const webpackConfig = require('./webpack.config.js')
const config = require('./config.js')

if (process.env.NODE_ENV === 'production') {
  webpack(webpackConfig, (err, stats) => {
    if (err) return console.log(err)
    console.log(stats.toString({
      colors: true
    }) + '\n')
  })
} else {
  webpackServe({}, {
    config: webpackConfig,
    hotClient: {
      reload: false,
      port: config.websocketPort
    },
    port: config.devServerPort
  })
}
