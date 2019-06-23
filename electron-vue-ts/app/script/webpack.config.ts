import { Configuration, HotModuleReplacementPlugin, DefinePlugin } from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
import * as webpackNodeExternals from 'webpack-node-externals'
import config from './config'
import { getPath } from './util'
import * as TerserWebpackPlugin from 'terser-webpack-plugin'

const indexHtml = getPath('./src/renderer/index.html')

const cssLoader = [
  config.mode === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
  'css-loader'
]

export const mainConfig: Configuration = {
  mode: config.mode,
  context: getPath(),
  target: 'electron-main',
  entry: {
    main: [getPath('./src/main/main.ts')]
  },
  output: {
    filename: '[name].js',
    path: getPath(config.outputPath)
  },
  node: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: config.mode !== 'production',
              configFile: getPath('./src/main/tsconfig.json')
            }
          }
        ]
      },
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
    extensions: ['.ts', '.js', 'json']
  },
  plugins: [
    new DefinePlugin({
      'process.isLinux': JSON.stringify(process.platform === 'linux')
    })
  ]
}

export const preloadConfig: Configuration = {
  mode: config.mode,
  context: getPath(),
  target: 'electron-renderer',
  entry: {
    preload: [getPath('./src/preload/preload.ts')]
  },
  output: {
    filename: '[name].js',
    path: getPath(config.outputPath)
  },
  node: false,
  externals: [webpackNodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: config.mode !== 'production',
              configFile: getPath('./src/preload/tsconfig.json')
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@': getPath('src')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  }
}

export const rendererConfig: Configuration = {
  mode: config.mode,
  context: getPath(),
  target: 'web',
  entry: {
    renderer: [getPath('./src/renderer/renderer.ts')]
  },
  output: {
    filename: '[name].js',
    path: getPath(config.outputPath)
  },
  // node: false,
  // externals: [webpackNodeExternals({
  //   whitelist: mode === 'production' ? [/vue/] : [/webpack/]
  // })],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts(x)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: config.mode !== 'production',
              configFile: getPath('./src/renderer/tsconfig.json')
            }
          }
        ]
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
      ecma: 8,
      output: {
        beautify: false
      }
    }
  })

  // (rendererConfig.output as any).chunkFilename = '[name]-[hash:8].js'

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
  preloadConfig.optimization = {
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
      (server as any)._watch(indexHtml)
    }
  }
  rendererConfig.devtool = mainConfig.devtool = preloadConfig.devtool = 'eval-source-map'
  rendererConfig.plugins = [
    ...(rendererConfig.plugins || []),
    new HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin({
      tslint: true,
      tsconfig: getPath('./src/renderer/tsconfig.json'),
      vue: true
    })
  ]

  preloadConfig.plugins = [
    ...(preloadConfig.plugins || []),
    new ForkTsCheckerWebpackPlugin({
      tslint: true,
      tsconfig: getPath('./src/preload/tsconfig.json')
    })
  ]

  mainConfig.plugins = [
    ...(mainConfig.plugins || []),
    new ForkTsCheckerWebpackPlugin({
      tslint: true,
      tsconfig: getPath('./src/main/tsconfig.json')
    })
  ]

  if (config.publicPath) {
    rendererConfig.output && (rendererConfig.output.publicPath = config.publicPath)
  }
}
