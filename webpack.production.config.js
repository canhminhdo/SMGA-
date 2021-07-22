var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    app: ['./src/index']
  },

  output: {
    path: path.join(__dirname, './build'),
    filename: '[name].js'
  },

  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.(woff2?|ttf|svg|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['src', 'node_modules']
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
