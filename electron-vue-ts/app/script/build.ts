import { mainConfig, rendererConfig, preloadConfig } from './webpack.config'
import { compile } from './util'

export default function build () {
  return Promise.all([
    compile(mainConfig),
    compile(preloadConfig),
    compile(rendererConfig)
  ])
}

if (require.main === module) {
  build().catch(err => console.log(err))
}
