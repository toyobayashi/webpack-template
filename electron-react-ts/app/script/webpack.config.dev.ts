import { Configuration, HotModuleReplacementPlugin } from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
import * as webpackNodeExternals from 'webpack-node-externals'
import config from './config'
import getPath from './get-path'

export const mainConfig: Configuration = {
  mode: 'development',
  context: getPath(),
  target: 'electron-main',
  devtool: 'eval-source-map',
  entry: {
    main: [getPath('./src/main.ts')]
  },
  output: {
    filename: '[name].js',
    path: config.outputPath || getPath('out')
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
  externals: [webpackNodeExternals()],
  resolve: {
    extensions: ['.ts', '.js']
  }
}

export const rendererConfig: Configuration = {
  mode: 'development',
  context: getPath(),
  target: 'electron-renderer',
  devtool: 'eval-source-map',
  entry: {
    renderer: [getPath('./src/index.tsx')]
  },
  output: {
    filename: '[name].js',
    path: config.outputPath || getPath('out'),
    publicPath: config.publicPath
  },
  node: false,
  externals: [webpackNodeExternals({
    whitelist: [/webpack/]
  })],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'template-electron-react-ts',
      template: getPath('./src/index.html'),
      chunks: ['renderer', 'dll', 'common']
    }),
    new HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin()
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
  },
  devServer: {
    stats: config.statsOptions,
    hot: true,
    host: config.devServerHost,
    inline: true,
    contentBase: config.contentBase,
    publicPath: config.publicPath
  }
}
