const { mainConfig, rendererConfig } = require('./webpack.config.js')
const { compile } = require('./util.js')
const config = require('./config.js')

function build () {
  return Promise.all([
    compile(mainConfig, config.statsOptions),
    compile(rendererConfig, config.statsOptions)
  ])
}

if (require.main === module) {
  build().catch(err => console.log(err))
}

module.exports = build
