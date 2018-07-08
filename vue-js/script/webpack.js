const webpack = require('webpack')
const webpackServe = require('webpack-serve')
const webpackConfig = require('./webpack.config.js')
const config = require('./config.js')

if (process.env.NODE_ENV === 'production') {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(stats.toString({
      colors: true
    }) + '\n')
  })
} else {
  webpackServe({
    config: webpackConfig,
    hot: {
      reload: false,
      port: config.websocketPort
    },
    port: config.devServerPort
  })
}
