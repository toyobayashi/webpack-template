import path from 'path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

let webpackConfig: Configuration = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: [path.join(__dirname, '../src/index.ts')],
  output: {
    filename: 'main.js',
    path: path.join(__dirname, '../public')
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
      title: 'template-vue-js',
      template: path.join(__dirname, '../src/index.html')
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    new MiniCssExtractPlugin({
      filename: 'main.css'
    })
  ]
  webpackConfig.optimization = {
    minimizer: [
      new UglifyJSPlugin({
        parallel: true,
        cache: true,
        uglifyOptions: {
          ecma: 5,
          output: {
            comments: false,
            beautify: false
          },
          warnings: false
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
} else {
  webpackConfig.plugins = [
    ...(webpackConfig.plugins || []),
    new ForkTsCheckerWebpackPlugin()
  ]
}

export default webpackConfig
