// http://survivejs.com/webpack_react/building_kanban/

var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var merge = require('webpack-merge');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

var TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

var common = {
  entry: APP_PATH,
  output: {
    path: BUILD_PATH,
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: APP_PATH
      }
    ]
  },
  plugins: [
    new HtmlwebpackPlugin({
      title: 'Kanban app'
    })
  ]
};

// production
if(TARGET === 'build') {
  module.exports = merge(common, {
    // devtool:  'source-map',
    entry: {
      app: APP_PATH,
    },
    output: {
      path: BUILD_PATH,
      filename: '[name].[chunkhash].js'
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['babel'],
          include: APP_PATH,
          // filename: 'application.[hash].js?'
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: APP_PATH
        }
      ]
    },
    plugins: [
      new Clean(['build'],{
        verbose: false // Don't write logs to console
      }),
      new ExtractTextPlugin('styles.[chunkhash].css'),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['manifest']
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}