import { Configuration, HotModuleReplacementPlugin } from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
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
    renderer: mode === 'production' ? [getPath('./src/index.tsx')] : ['react-hot-loader/patch', getPath('./src/index-dev.tsx')]
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
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: mode !== 'production' ? [
          'react-hot-loader/webpack',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ] : [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: false
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
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'template-electron-react-ts',
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
    new HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin()
  ]

  if (config.publicPath) {
    rendererConfig.output && (rendererConfig.output.publicPath = config.publicPath)
  }
}
