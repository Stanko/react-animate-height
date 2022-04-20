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
// const imgPath = path.join(__dirname, './source/assets/img');
const sourcePath = path.join(__dirname, './source');
const docsPath = path.join(__dirname, './docs');

const outputDistPath = isExample ? exampleDistPath : distPath;

// const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
// const componentName = packageJson.name;

// Common plugins
const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV),
    },
  }),
];

const entry = {};

// Common rules
const rules = [
  {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    loader: 'swc-loader'
  },
];

if (isProduction) {
  // Production entry points
  entry['docs.min'] = path.join(docsPath, 'docs.tsx');

  // Production plugins
  // plugins.push(
  //   new ExtractTextPlugin('demo.css')
  // );

  if (isExample) {
    plugins.push(
      new HtmlWebpackPlugin({
        template: path.join(docsPath, 'index.html'),
        path: outputDistPath,
        filename: 'index.html',
      })
    );
  }

  // // Production rules
  // rules.push(
  //   {
  //     test: /\.css$/,
  //     loader: ExtractTextPlugin.extract({
  //       fallback: 'style-loader',
  //       loader: 'css-loader',
  //     }),
  //   }
  // );
} else {
  // Development entry points
  entry.docs = path.join(docsPath, 'docs.tsx');

  // Development plugins
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(docsPath, 'index.html'),
      path: outputDistPath,
      filename: 'index.html',
    })
  );

  // Development rules
  rules.push(
    {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [
        'style-loader',
        { loader: 'css-loader', options: { sourceMap: true } },
      ],
    }
  );
}

module.exports = {
  devtool: isProduction ? false : 'source-map',
  context: isProduction ? outputDistPath : sourcePath,
  entry,
  mode: isProduction ? 'production' : 'development',
  output: {
    path: outputDistPath,
    // publicPath: '/',
    filename: '[name].js',
  },
  optimization: {
    moduleIds: 'named'
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx', '.ts', '.tsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath,
    ],
  },
  plugins,
  devServer: {
    static: {
      directory: isProduction ? distPath : sourcePath,
    },
    historyApiFallback: true,
    compress: isProduction,
    // inline: !isProduction,
    hot: !isProduction,
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
