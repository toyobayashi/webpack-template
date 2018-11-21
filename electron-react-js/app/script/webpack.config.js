const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const webpackNodeExternals = require('webpack-node-externals')
const { mode, getPath, config } = require('./constant.js')

const mainConfig = {
  mode,
  context: getPath(),
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
  context: getPath(),
  target: 'electron-renderer',
  entry: {
    renderer: [getPath('./src/index.jsx')]
  },
  output: {
    filename: '[name].js',
    path: getPath(config.outputPath)
  },
  node: false,
  externals: [webpackNodeExternals({
    whitelist: mode === 'production' ? [/react/] : [/webpack/, /react-hot-loader/]
  })],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-react'
              ],
              plugins: mode !== 'production' ? ['react-hot-loader/babel'] : void 0
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'template-electron-react-js',
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

if (mode === 'production') {
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
