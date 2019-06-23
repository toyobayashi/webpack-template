import * as webpack from 'webpack'

type WebpackToString = boolean | 'errors-only' | 'errors-warnings' | 'minimal' | 'none' | 'normal' | 'verbose' | webpack.Stats.ToStringOptionsObject

interface InnoConfig {
  appid: string
  url: string
}

interface Config {
  mode: 'production' | 'development'
  devServerHost: string
  devServerPort: number
  outputPath: string
  contentBase: string
  publicPath: string
  distPath: string
  iconSrcDir: string
  iconOutDir: string
  inno: InnoConfig
  statsOptions: WebpackToString
}

const config: Config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devServerHost: 'localhost',
  devServerPort: 7080,
  outputPath: 'out',
  contentBase: '..',
  publicPath: '/app/out/',
  distPath: '../dist',
  iconSrcDir: './res',
  iconOutDir: 'img',
  inno: {
    appid: '527DE8CC-F8A6-4ADF-8977-38BEC5BD8F41',
    url: ''
  },

  statsOptions: {
    colors: true,
    children: false,
    modules: false,
    entrypoints: false
  }
}

export default config
