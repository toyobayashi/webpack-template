import * as path from 'path'
import { Configuration } from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

let mainConfig: Configuration = {
  mode,
  target: 'electron-main',
  entry: {
    main: [path.join(__dirname, '../src/main.ts')]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../public')
  },
  node: {
    __dirname: false,
    __filename: false
  },
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
    extensions: ['.ts', '.js']
  }
}

let rendererConfig: Configuration = {
  mode,
  target: 'electron-renderer',
  entry: {
    renderer: [path.join(__dirname, '../src/index.ts')]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../public')
  },
  node: {
    __dirname: false,
    __filename: false
  },
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
      inject: false,
      template: path.join(__dirname, '../src/index.template.ts')
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  const uglifyJSPlugin = () => new UglifyJSPlugin({
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
  })

  rendererConfig.plugins = [
    ...(rendererConfig.plugins || []),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
  rendererConfig.optimization = {
    minimizer: [
      uglifyJSPlugin(),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
  mainConfig.optimization = {
    minimizer: [uglifyJSPlugin()]
  }
} else {
  rendererConfig.plugins = [
    ...(rendererConfig.plugins || []),
    new ForkTsCheckerWebpackPlugin()
  ]
}

export default { mainConfig, rendererConfig }
