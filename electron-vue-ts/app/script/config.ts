import * as webpack from 'webpack'

type WebpackToString = boolean | 'errors-only' | 'errors-warnings' | 'minimal' | 'none' | 'normal' | 'verbose' | webpack.Stats.ToStringOptionsObject

interface Config {
  mode: 'production' | 'development'
  devServerHost: string
  devServerPort: number
  outputPath: string
  contentBase: string
  publicPath: string
  statsOptions: WebpackToString
}

const config: Config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devServerHost: 'localhost',
  devServerPort: 7080,
  outputPath: 'out',
  contentBase: '..',
  publicPath: '/app/out/',

  statsOptions: 'errors-warnings' /* {
    colors: true,
    children: false,
    modules: false,
    entrypoints: false
  } */
}

export default config
