import webpack from 'webpack'
import webpackConfig from './webpack.config'
import config from './config'

if (process.env.NODE_ENV === 'production') {
  webpack(webpackConfig, (err, stats) => {
    if (err) return console.log(err)
    console.log(stats.toString({
      colors: true
    }) + '\n')
  })
} else {
  require('webpack-serve')({}, {
    config: webpackConfig,
    hotClient: {
      reload: false,
      port: config.websocketPort
    },
    port: config.devServerPort
  })
}
