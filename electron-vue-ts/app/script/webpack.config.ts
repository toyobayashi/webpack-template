import { Configuration, HotModuleReplacementPlugin, DefinePlugin } from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
import * as webpackNodeExternals from 'webpack-node-externals'
import config from './config'
import { getPath } from './util'

const TerserWebpackPlugin = require('terser-webpack-plugin')

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
        loader: 'ts-loader'
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './img/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  externals: [webpackNodeExternals()],
  resolve: {
    alias: {
      '@': getPath('src', 'renderer'),
      '~': getPath('src', 'main')
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
    preload: [getPath('./src/renderer/preload.ts')]
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
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    alias: {
      '@': getPath('src', 'renderer'),
      '~': getPath('src', 'main')
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
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: config.mode !== 'production'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          config.mode === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '@': getPath('src', 'renderer'),
      '~': getPath('src', 'main')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.css', '.json']
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'template-electron-vue-js',
      template: getPath('./src/renderer/index.html'),
      chunks: ['renderer', 'dll', 'common']
    })
  ]/* ,
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
  } */
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
  });

  (rendererConfig.output as any).chunkFilename = '[name]-[hash:8].js'

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
  rendererConfig.devtool = mainConfig.devtool = preloadConfig.devtool = 'eval-source-map'
  rendererConfig.plugins = [
    ...(rendererConfig.plugins || []),
    new HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin()
  ]

  if (config.publicPath) {
    rendererConfig.output && (rendererConfig.output.publicPath = config.publicPath)
  }
}
