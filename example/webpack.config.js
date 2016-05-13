var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

var config = {
  debug: true,
  devtool: 'source-map',

  entry: {
    index: 'index.js'
  },

  resolve: {
    root: __dirname + '/src/',
    extensions: ["", '.js', '.jql']
  },

  module: {
    loaders: [
      {
        test: /\.(js|jql)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.jql$/,
        loader: 'jql-loader'
      }
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ]
}

module.exports = config
