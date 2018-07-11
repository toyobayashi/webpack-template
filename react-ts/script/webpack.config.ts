import path from 'path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

let webpackConfig: Configuration = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: [path.join(__dirname, '../src/index.tsx')],
  output: {
    filename: 'main.js',
    path: path.join(__dirname, '../public')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // babelrc: false,
              plugins: ['react-hot-loader/babel']
            }
          },
          {
            loader: 'ts-loader',
            options: {
              configFile: process.env.NODE_ENV === 'production' ? 'tsconfig.json' : 'tsconfig.dev.json',
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.css', '.ts', '.tsx', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'template-react-ts',
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
}

export default webpackConfig
