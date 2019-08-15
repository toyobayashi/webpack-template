const config = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devServerHost: 'localhost',
  devServerPort: 9080,
  outputPath: 'out',
  contentBase: '..',
  publicPath: '/app/out/',
  distPath: '../dist',
  iconSrcDir: './res',
  iconOutDir: 'img',
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
