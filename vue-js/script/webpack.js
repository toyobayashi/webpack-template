const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const config = require('./config.json')
const DevServer = require('webpack-dev-server')
const fs = require('fs-extra')

const statsOptions = {
  colors: true
}

if (process.env.NODE_ENV === 'production') {
  webpack(webpackConfig, (err, stats) => {
    if (err) return console.log(err)
    console.log(stats.toString(statsOptions) + '\n')
  })
} else {
  if (webpackConfig.output) {
    if (fs.existsSync(webpackConfig.output.path)) fs.removeSync(webpackConfig.output.path)
  }
  const devServerOptions = {
    stats: statsOptions,
    hot: true,
    host: config.host,
    inline: true,
    contentBase: webpackConfig.context,
    publicPath: config.publicPath
  }
  DevServer.addDevServerEntrypoints(webpackConfig, devServerOptions)
  const server = new DevServer(webpack(webpackConfig), devServerOptions)
  server.listen(config.port, config.host, () => {
    require('opn')(`http://${config.host}:${config.port}${config.publicPath}`)
  })
}
