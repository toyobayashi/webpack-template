import { mainConfig, rendererConfig, preloadConfig } from './webpack.config'
import { watch, startDevServer } from './util'
import config from './config'
import start from './start'
import { ChildProcess } from 'child_process'

export default function dev () {
  let appProcess: ChildProcess | null = null

  const firstLaunch = {
    main: false,
    preload: false,
    renderer: false
  }

  const relaunch = function relaunch () {
    if (appProcess) {
      appProcess.kill()
      appProcess = null
    }
    appProcess = start()
  }

  watch(mainConfig, function watchHandler (err, stats) {
    if (err) {
      console.log(err)
      return
    }
    console.log(stats.toString(config.statsOptions) + '\n')

    if (!firstLaunch.main) firstLaunch.main = true

    if (firstLaunch.main && firstLaunch.preload && firstLaunch.renderer) {
      relaunch()
    }
  })

  watch(preloadConfig, function watchHandler (err, stats) {
    if (err) {
      console.log(err)
      return
    }
    console.log(stats.toString(config.statsOptions) + '\n')

    if (!firstLaunch.preload) firstLaunch.preload = true

    if (firstLaunch.main && firstLaunch.preload && firstLaunch.renderer) {
      relaunch()
    }
  })

  startDevServer(rendererConfig, config.devServerPort, config.devServerHost, function (err) {
    if (err) {
      console.log(err)
      return
    }
    if (!firstLaunch.renderer) firstLaunch.renderer = true

    if (firstLaunch.main && firstLaunch.preload && firstLaunch.renderer) {
      relaunch()
    }
  })
}

if (require.main === module) {
  dev()
}
