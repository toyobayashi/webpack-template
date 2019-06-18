interface Config {
  mode: 'production' | 'development'
  devServerHost: string
  devServerPort: number
  outputPath: string
  contentBase: string
  publicPath: string
}

const config: Config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devServerHost: 'localhost',
  devServerPort: 7080,
  outputPath: 'out',
  contentBase: '..',
  publicPath: '/app/out/'
}

export default config
