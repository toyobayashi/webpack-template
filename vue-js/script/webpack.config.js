const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const config = require('./config.json')

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const root = path.join(__dirname, '..')
const getPath = (...args) => path.join(root, ...args)

let webpackConfig = {
  mode,
  context: root,
  entry: {
    main: ['@babel/polyfill', getPath('./src/index.js')]
  },
  output: {
    filename: '[name].js',
    path: getPath(config.publicPath)
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env', {
                modules: false
              }
            ]
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          mode === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'template-vue-js',
      template: getPath('./src/index.html')
    })
  ]
}

if (mode === 'production') {
  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
  webpackConfig.optimization = {
    minimizer: [
      new UglifyJSPlugin({
        parallel: true,
        cache: true,
        uglifyOptions: {
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
} else {
  webpackConfig.devtool = 'eval-source-map'
  webpackConfig.output && (webpackConfig.output.publicPath = config.publicPath)
  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = webpackConfig
