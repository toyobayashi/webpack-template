import path from 'path'
import { Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

let mainConfig: Configuration = {
  mode,
  target: 'electron-main',
  entry: [path.join(__dirname, '../src/main.ts')],
  output: {
    filename: 'main.js',
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
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: [path.join(__dirname, '../src/index.ts')],
  output: {
    filename: 'renderer.js',
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
              appendTsSuffixTo: [/\.vue$/]
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
      template: path.join(__dirname, '../src/index.html')
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
      filename: 'renderer.css'
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
}

export default { mainConfig, rendererConfig }
