const { HotModuleReplacementPlugin, DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpackNodeExternals = require('webpack-node-externals')
const config = require('./config.js')
const { getPath } = require('./util.js')

const indexHtml = getPath('./src/renderer/index.html')

const cssLoader = [
  config.mode === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
  'css-loader'
]

const mainConfig = {
  mode: config.mode,
  context: getPath(),
  target: 'electron-main',
  entry: {
    main: [getPath('./src/main/main.js')]
  },
  output: {
    filename: '[name].js',
    path: getPath(config.outputPath)
  },
  node: false,
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `./${config.iconOutDir}/[name].[ext]`
            }
          }
        ]
      }
    ]
  },
  externals: [webpackNodeExternals()],
  resolve: {
    alias: {
      '@': getPath('src')
    },
    extensions: ['.js', '.json']
  },
  plugins: [
    new DefinePlugin({
      'process.isLinux': JSON.stringify(process.platform === 'linux')
    })
  ]
}

let rendererConfig = {
  mode: config.mode,
  context: getPath(),
  target: 'electron-renderer',
  entry: {
    renderer: [getPath('./src/renderer/renderer.js')]
  },
  output: {
    filename: '[name].js',
    path: getPath(config.outputPath)
  },
  node: false,

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          ...cssLoader
        ]
      },
      {
        test: /\.styl(us)?$/,
        use: [
          ...cssLoader,
          'stylus-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@': getPath('src')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.css', '.styl', '.json']
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: require('../package.json').name,
      template: indexHtml,
      minify: config.mode === 'production' ? {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        removeScriptTypeAttributes: true
      } : false /* ,
      chunks: ['renderer', 'dll', 'common'] */
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        'node-modules': {
          name: 'node-modules',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  }
}

if (config.mode === 'production') {
  const terser = () => new TerserWebpackPlugin({
    parallel: true,
    cache: true,
    terserOptions: {
      ecma: 9,
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
      terser(),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
  mainConfig.optimization = {
    ...(mainConfig.optimization || {}),
    minimizer: [terser()]
  }
} else {
  rendererConfig.devServer = {
    stats: config.statsOptions,
    hot: true,
    host: config.devServerHost,
    inline: true,
    contentBase: getPath(config.contentBase),
    publicPath: config.publicPath,
    before (_app, server) {
      server._watch(indexHtml)
    }
  }
  rendererConfig.devtool = mainConfig.devtool = 'eval-source-map'
  rendererConfig.plugins = [
    ...(rendererConfig.plugins || []),
    new HotModuleReplacementPlugin()
  ]

  if (config.publicPath) {
    rendererConfig.output && (rendererConfig.output.publicPath = config.publicPath)
  }
}

module.exports = { mainConfig, rendererConfig }
