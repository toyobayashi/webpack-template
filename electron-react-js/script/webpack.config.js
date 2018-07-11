const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

let mainConfig = {
  mode,
  target: 'electron-main',
  entry: [path.join(__dirname, '../src/main.js')],
  output: {
    filename: 'main.js',
    path: path.join(__dirname, '../public')
  },
  node: {
    __dirname: false,
    __filename: false
  }
}

let rendererConfig = {
  mode,
  target: 'electron-renderer',
  entry: [path.join(__dirname, '../src/index.jsx')],
  output: {
    filename: 'renderer.js',
    path: path.join(__dirname, '../public')
  },
  node: {
    __dirname: false,
    __filename: false
  },
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
                'react'
              ],
              plugins: process.env.NODE_ENV !== 'production' ? ['react-hot-loader/babel'] : void 0
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'template-electron-react-js',
      template: path.join(__dirname, '../src/index.html')
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  rendererConfig.plugins = [
    ...(rendererConfig.plugins || []),
    new MiniCssExtractPlugin({
      filename: 'renderer.css'
    })
  ]
  rendererConfig.optimization = {
    minimizer: [
      new UglifyJSPlugin({
        parallel: true,
        cache: true,
        uglifyOptions: {
          ecma: 8,
          output: {
            comments: false,
            beautify: false
          },
          warnings: false
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
}

module.exports = { mainConfig, rendererConfig }
