import * as webpack from 'webpack'
import { mainConfig, rendererConfig, preloadConfig } from './webpack.config'
import { getPath } from './util'
import config from './config'
import * as DevServer from 'webpack-dev-server'
// import * as fs from 'fs-extra'

const statsOptions = {
  colors: true,
  children: false,
  modules: false,
  entrypoints: false
}

if (require.main === module) {
  main()
}

function main () {
  if (process.env.NODE_ENV === 'production') {
    prod().catch(err => {
      console.log(err)
    })
    return
  }
  // if (rendererConfig.output && typeof rendererConfig.output.path === 'string') {
  //   if (fs.existsSync(rendererConfig.output.path)) fs.removeSync(rendererConfig.output.path)
  // }
  const mainCompiler = webpack(mainConfig)
  mainCompiler.watch({
    aggregateTimeout: 200,
    poll: undefined
  }, (err, stats) => console.log(err || (stats.toString(statsOptions) + '\n')))

  const preloadCompiler = webpack(preloadConfig)
  preloadCompiler.watch({
    aggregateTimeout: 200,
    poll: undefined
  }, (err, stats) => console.log(err || (stats.toString(statsOptions) + '\n')))

  const devServerOptions: DevServer.Configuration = {
    stats: statsOptions,
    hot: true,
    host: config.devServerHost,
    inline: true,
    contentBase: getPath(config.contentBase)
  }
  if (config.publicPath) devServerOptions.publicPath = config.publicPath

  DevServer.addDevServerEntrypoints(rendererConfig, devServerOptions)
  const server = new DevServer(webpack(rendererConfig), devServerOptions)

  server.listen(config.devServerPort, config.devServerHost, (err) => {
    if (err) console.log(err)
  })
}

export default function prod () {
  // if (rendererConfig.output && typeof rendererConfig.output.path === 'string') {
  //   if (fs.existsSync(rendererConfig.output.path)) fs.removeSync(rendererConfig.output.path)
  // }
  const webpackPromise = (option: webpack.Configuration) => new Promise((resolve, reject) => {
    webpack(option, (err, stats) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      console.log(stats.toString(statsOptions) + '\n')
      resolve()
    })
  })

  return Promise.all([
    webpackPromise(mainConfig),
    webpackPromise(preloadConfig),
    webpackPromise(rendererConfig)
  ])
}
