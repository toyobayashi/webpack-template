module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  getPath (...relative) { return require('path').join(__dirname, '..', ...relative) },
  config: require('./config.json')
}
