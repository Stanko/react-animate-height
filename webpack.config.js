/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
// const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const EXAMPLE = process.env.EXAMPLE || 'false';
const isExample = EXAMPLE === 'true';
const isProduction = NODE_ENV === 'production';

const distPath = path.join(__dirname, './dist');
const exampleDistPath = path.join(__dirname, './dist-docs');
const sourcePath = path.join(__dirname, './source');
const docsPath = path.join(__dirname, './docs');

const outputDistPath = isExample ? exampleDistPath : distPath;

module.exports = {
  entry: './docs/docs.tsx',
  mode: isProduction ? 'production' : 'development',
  output: {
    path: outputDistPath,
    filename: '[name].js',
  },
  optimization: {
    moduleIds: 'named'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'swc-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: !isProduction } },
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx', '.ts', '.tsx'],
    fallback: {
      "events": require.resolve("events/")
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(docsPath, 'index.html'),
      path: outputDistPath,
      filename: 'index.html',
    })
  ],
  devServer: {
    static: {
      directory: isProduction ? distPath : sourcePath,
    },
    historyApiFallback: true,
    compress: isProduction,
    // inline: !isProduction,
    // hot: !isProduction,
    host: '0.0.0.0',
    allowedHosts: 'all',
    // stats: {
    //   assets: true,
    //   children: false,
    //   chunks: false,
    //   hash: false,
    //   modules: false,
    //   publicPath: false,
    //   timings: true,
    //   version: false,
    //   warnings: true,
    //   colors: {
    //     green: '\u001b[32m',
    //   },
    // },
  },
};
