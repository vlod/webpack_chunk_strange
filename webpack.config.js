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
      // {
      //   test: /\.scss$/,
      //   //loaders: ['style', 'css?sourceMap!', 'sass?sourceMap'] // have to potentially hover over chrome (others work fine) to see changes
      //   loaders: ['style', 'css', 'sass'],
      //   include: path.resolve(ROOT_PATH, 'app')
      // },
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

if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    module: {
      loaders: [
        {
          test: /\.scss$/,
          //loaders: ['style', 'css?sourceMap!', 'sass?sourceMap'] // have to potentially hover over chrome (others work fine) to see changes
          loaders: ['style', 'css', 'sass'],
          include: APP_PATH
        }
      ]
    },
    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}

// production
if(TARGET === 'build') {
  module.exports = merge(common, {
    // devtool:  'source-map',
    entry: {
      app: APP_PATH,
    },
    output: {
      path: BUILD_PATH,
      filename: 'app.[hash].js'
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
          test: /\.scss$/,
          //loaders: ['style', 'css?sourceMap!', 'sass?sourceMap'] // have to potentially hover over chrome (others work fine) to see changes
          loader: ExtractTextPlugin.extract('style', 'css!sass'),
          include: APP_PATH
        }
      ]
    },
    plugins: [
      new Clean(['build']),
      new ExtractTextPlugin('styles.[hash].css'),
      new webpack.DefinePlugin({
        'process.env': {
          // This affects react lib size
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