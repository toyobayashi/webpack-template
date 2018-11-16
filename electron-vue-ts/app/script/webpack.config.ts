import { Configuration, HotModuleReplacementPlugin } from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
import * as webpackNodeExternals from 'webpack-node-externals'
import { mode, getPath, config } from './constant'

const TerserWebpackPlugin = require('terser-webpack-plugin')

export const mainConfig: Configuration = {
  mode,
  context: getPath(),
  target: 'electron-main',
  entry: {
    main: [getPath('./src/main.ts')]
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
  externals: [webpackNodeExternals()],
  resolve: {
    extensions: ['.ts', '.js']
  }
}

export const rendererConfig: Configuration = {
  mode,
  context: getPath(),
  target: 'electron-renderer',
  entry: {
    renderer: [getPath('./src/index.ts')]
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
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: process.env.NODE_ENV !== 'production'
            }
          }
        ]
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
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.css']
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
    new HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin()
  ]

  if (config.publicPath) {
    rendererConfig.output && (rendererConfig.output.publicPath = config.publicPath)
  }
}
