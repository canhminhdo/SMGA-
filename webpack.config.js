var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'eval',

  entry: {
    app: [
      'webpack-dev-server/client?http://0.0.0.0:3000',
      'webpack/hot/only-dev-server',
      './src/index'
    ]
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, './build'),
    publicPath: '/build/'
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['src', 'node_modules']
  },

  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      {
        test: /\.js?$/,
        loaders: ['react-hot', 'babel'],
        exclude: /node_modules/
      },
      {
        test: /\.(otf|eot|svg|ttf|woff)/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]

};