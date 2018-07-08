import webpack from 'webpack'
import webpackServe from 'webpack-serve'
import webpackConfig from './webpack.config'
import config from './config'

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
