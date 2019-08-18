const config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devServerHost: 'localhost',
  devServerPort: 9080,
  output: {
    web: 'dist',
    renderer: 'resources/app/renderer',
    main: 'resources/app/main'
  },
  contentBase: 'resources/app/renderer',
  resourcesPath: 'resources',
  publicPath: '/',
  distPath: 'dist',
  iconSrcDir: 'icon',
  inno: {
    appid: '', // 527DE8CC-F8A6-4ADF-8977-38BEC5BD8F41
    url: ''
  },

  statsOptions: {
    colors: true,
    children: false,
    modules: false,
    entrypoints: false
  }
}

module.exports = config
