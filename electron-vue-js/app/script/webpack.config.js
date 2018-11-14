const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpackNodeExternals = require('webpack-node-externals')
const { mode, getPath, config } = require('./constant.js')

const mainConfig = {
  mode,
  target: 'electron-main',
  entry: {
    main: [getPath('./src/main.js')]
  },
  output: {
    filename: '[name].js',
    path: getPath(config.outputPath)
  },
  node: false,
  externals: [webpackNodeExternals()]
}

let rendererConfig = {
  mode,
  target: 'electron-renderer',
  entry: {
    renderer: [getPath('./src/index.js')]
  },
  output: {
    filename: '[name].js',
    path: getPath(config.outputPath)
  },
  node: false,
  externals: [webpackNodeExternals({
    whitelist: mode === 'production' ? [/vue/] : [/webpack/]
  })],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'template-electron-vue-js',
      template: getPath('./src/index.html'),
      chunks: ['renderer', 'dll', 'common']
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'common',
      cacheGroups: {
        dll: {
          test: /[\\/]node_modules[\\/]/,
          name: 'dll'
        }
      }
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  const uglifyJS = () => new TerserWebpackPlugin({
    parallel: true,
    cache: true,
    terserOptions: {
      ecma: 8,
      output: {
        beautify: false
      }
    }
  })

  rendererConfig.plugins = [
    ...(rendererConfig.plugins || []),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
  rendererConfig.optimization = {
    ...(rendererConfig.optimization || {}),
    minimizer: [
      uglifyJS(),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
  mainConfig.optimization = {
    ...(mainConfig.optimization || {}),
    minimizer: [uglifyJS()]
  }
} else {
  rendererConfig.devtool = mainConfig.devtool = 'eval-source-map'
  rendererConfig.plugins = [
    ...(rendererConfig.plugins || []),
    new webpack.HotModuleReplacementPlugin()
  ]

  if (config.publicPath) {
    rendererConfig.output && (rendererConfig.output.publicPath = config.publicPath)
  }
}

module.exports = { mainConfig, rendererConfig }
