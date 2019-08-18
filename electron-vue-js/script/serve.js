const { mainConfig, rendererConfig } = require('./webpack.config.js')
const { watch, startDevServer } = require('./util.js')
const config = require('./config.js')

function serve () {
  watch(mainConfig, function watchHandler (err, stats) {
    if (err) {
      console.log(err)
      return
    }

    console.log(stats.toString(config.statsOptions) + '\n')
  })

  startDevServer(rendererConfig, config.devServerPort, config.devServerHost, function (err) {
    if (err) {
      console.log(err)
      // return
    }
  })
}

module.exports = serve

if (require.main === module) {
  serve()
}
