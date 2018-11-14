const config = require('./config.json')
if (!config.devServerHost) config.devServerHost = 'localhost'
if (!config.devServerPort) config.devServerPort = 7090
if (!config.outputPath) config.outputPath = 'public'
if (!config.contentBase) config.contentBase = '..'

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  getPath (...relative) { return require('path').join(__dirname, '..', ...relative) },
  config
}