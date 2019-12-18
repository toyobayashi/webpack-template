const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { mode, getPath, config } = require('./constant.js')

const webpackConfig = {
  mode,
  context: getPath(),
  entry: {
    main: [getPath('./src/index.js')]
  },
  output: {
    filename: '[name].js',
    path: getPath(config.outputPath)
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
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
      template: getPath('./src/index.html'),
      chunks: ['main', 'dll', 'common']
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
      ecma: 5,
      output: {
        beautify: false
      }
    }
  })
  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
  webpackConfig.optimization = {
    ...(webpackConfig.optimization || {}),
    minimizer: [
      uglifyJS(),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
} else {
  webpackConfig.devtool = 'eval-source-map'
  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    new webpack.HotModuleReplacementPlugin()
  ]

  if (config.publicPath) {
    webpackConfig.output && (webpackConfig.output.publicPath = config.publicPath)
  }
}

module.exports = webpackConfig
