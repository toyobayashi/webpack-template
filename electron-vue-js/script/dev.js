const { mainConfig, rendererConfig } = require('./webpack.config.js')
const { watch, startDevServer } = require('./util.js')
const config = require('./config.js')
const start = require('./start.js')

function dev () {
  let appProcess = null

  const onExit = function onExit (_code, signal) {
    appProcess = null
    if (signal === 'SIGKILL') {
      appProcess = start()
      appProcess.once('exit', onExit)
    }
  }

  const firstLaunch = {
    main: false,
    renderer: false
  }

  const isReady = () => firstLaunch.main && firstLaunch.renderer

  const relaunch = function relaunch () {
    if (appProcess) {
      appProcess.kill('SIGKILL')
    } else {
      appProcess = start()
      appProcess.once('exit', onExit)
    }
  }

  watch(mainConfig, function watchHandler (err, stats) {
    if (err) {
      console.log(err)
      return
    }

    if (!firstLaunch.main) firstLaunch.main = true

    if (isReady()) {
      relaunch()
    }

    console.log(stats.toString(config.statsOptions) + '\n')
  })

  startDevServer(rendererConfig, config.devServerPort, config.devServerHost, function (err) {
    if (err) {
      console.log(err)
      return
    }
    if (!firstLaunch.renderer) firstLaunch.renderer = true

    if (!appProcess && firstLaunch.main && firstLaunch.renderer) {
      relaunch()
    }
  })
}

module.exports = dev

if (require.main === module) {
  dev()
}
