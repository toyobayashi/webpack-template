const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { mode, getPath, config } = require('./constant.js')

const htmlMinify = {
  removeComments: true,
  collapseWhitespace: true,
  removeAttributeQuotes: true,
  collapseBooleanAttributes: true,
  removeScriptTypeAttributes: true
}

const webpackConfig = {
  mode,
  context: getPath(),
  entry: {
    main: ['@babel/polyfill', getPath('./src/index.js')]
  },
  output: {
    filename: '[name].js',
    path: getPath(config.outputPath)
  },
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
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
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          mode === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          'postcss-loader',
          {
            loader: 'stylus-loader',
            options: {
              preferPathResolver: 'webpack'
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          createUrlLoader('img')
        ]
      },
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          createFileLoader('img')
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          createUrlLoader('media')
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          createUrlLoader('fonts')
        ]
      },
      createEslintLoader(/\.(jsx?|vue)$/)
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: getPath('public'),
        to: getPath(config.outputPath),
        toType: 'dir',
        ignore: [
          '.gitkeep',
          '.DS_Store'
        ]
      }
    ]),
    ...config.html.map(tpl => {
      return new HtmlWebpackPlugin({
        title: tpl.title,
        template: getPath(tpl.template),
        minify: mode === 'production' ? htmlMinify : false
      })
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
      cacheGroups: {
        'node-modules': {
          name: 'node-modules',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'all'
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

function createUrlLoader (dir) {
  return {
    loader: 'url-loader',
    options: {
      limit: 4096,
      fallback: createFileLoader(dir, config)
    }
  }
}

function createFileLoader (dir) {
  return {
    loader: 'file-loader',
    options: {
      name: path.posix.join(config.assetsPath || '', dir, '[name].[ext]')
    }
  }
}

function createEslintLoader (test) {
  return {
    test,
    enforce: 'pre',
    exclude: /node_modules/,
    use: [{
      loader: 'eslint-loader',
      options: {
        emitWarning: true,
        emitError: false
      }
    }]
  }
}

module.exports = webpackConfig
