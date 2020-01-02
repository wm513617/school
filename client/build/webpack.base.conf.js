var path = require('path')
var config = require('../../config').frontend
var vueLoaderConfig = require('./vue-loader.conf')
var utils = require('./utils')
var webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: resolve('src/main.js')
  },
  output: {
    path: config.assetsRoot,
    publicPath: config.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [resolve('src'), resolve('../node_modules')],
    alias: {
      vue$: 'vue/dist/vue.common.js',
      src: resolve('src'),
      assets: resolve('src/assets'),
      components: resolve('src/components'),
      '@src': resolve('src'),
      '@http': resolve('src/http'),
      locales: resolve('src/locales'),
      shared: resolve('src/shared'),
      resources: resolve('src/resources')
    }
  },
  plugins: [new webpack.ProvidePlugin({ $: 'jquery' })],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('../node_modules/dot-prop')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(wav)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
