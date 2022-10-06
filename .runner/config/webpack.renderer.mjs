import { join, dirname, resolve } from 'path'
import packageJson from '../../package.json' assert { type: 'json' }
import webpack from 'webpack'

import TerserPlugin from 'terser-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import eslintFriendlyFormatter from 'eslint-friendly-formatter'
import ESLintPlugin from 'eslint-webpack-plugin'
import externalsWhiteList from './webpack.renderer.externals.whitelist.mjs'
import { fileURLToPath } from 'url'

const IS_DEV_ENV = process.env.NODE_ENV !== 'production'
const __dirname = dirname(fileURLToPath(import.meta.url))

process.env.BABEL_ENV = 'renderer'

export default {
  devtool: IS_DEV_ENV ? 'source-map' : false,
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  entry: {
    renderer: join(__dirname, '../../src/renderer/main.js')
  },
  externals: [
    ...Object.keys(packageJson.dependencies || {}).filter(d => !externalsWhiteList.includes(d))
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: !IS_DEV_ENV,
            loaders: {
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
              scss: 'vue-style-loader!css-loader!sass-loader',
              less: 'vue-style-loader!css-loader!less-loader'
            }
          }
        }
      },
      {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset/inline'
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset/inline'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/inline'
      }
    ]
  },
  node: {
    __dirname: IS_DEV_ENV,
    __filename: IS_DEV_ENV
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve(__dirname, '../../src/index.ejs'),
      templateParameters (compilation, assets, options) {
        return {
          compilation,
          webpack: compilation.getStats().toJson(),
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            files: assets,
            options
          },
          process
        }
      },
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      isDevelopment: IS_DEV_ENV,
      staticPath: join(__dirname, '/static').replace(/\\/g, '\\\\'),
      nodeModules: IS_DEV_ENV
        ? resolve(__dirname, '../../node_modules')
        : false
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'vue'],
      exclude: [
        '/node_modules/'
      ],
      formatter: eslintFriendlyFormatter()
    }),
    new webpack.DefinePlugin(IS_DEV_ENV
      ? {
          __static: `"${join(__dirname, '../../static').replace(/\\/g, '\\\\')}"`,
          __VUE_OPTIONS_API__: false,
          __VUE_PROD_DEVTOOLS__: false
        }
      : {
          'process.env.NODE_ENV': '"production"',
          __VUE_OPTIONS_API__: false,
          __VUE_PROD_DEVTOOLS__: false
        }
    ),
    ...IS_DEV_ENV
      ? []
      : [new CopyWebpackPlugin({
          patterns: [
            {
              from: join(__dirname, '../../static'),
              to: join(__dirname, '../../dist/electron/static')
            }
          ]
        })],
    ...IS_DEV_ENV
      ? []
      : [new webpack.LoaderOptionsPlugin({
          minimize: true
        })]
  ],
  cache: true,
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: join(__dirname, '../../dist/electron')
  },
  resolve: {
    alias: {
      '@': join(__dirname, '../../src/renderer'),
      vue$: `vue/dist/vue.esm-browser${IS_DEV_ENV ? '' : '.prod'}`
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node']
  },
  target: 'electron-renderer'
}
