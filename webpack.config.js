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
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [
      'babel-loader',
    ],
  },
  // {
  //   test: /\.(png|gif|jpg|svg)$/,
  //   include: imgPath,
  //   use: 'url-loader?limit=20480&name=assets/[name]-[hash].[ext]',
  // },
];

if (isProduction) {
  // Production entry points
  entry['docs.min'] = path.join(docsPath, 'docs.js');

  // Production plugins
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    }),
    new ExtractTextPlugin('demo.css')
  );

  if (isExample) {
    plugins.push(
      new HtmlWebpackPlugin({
        template: path.join(docsPath, 'index.html'),
        path: outputDistPath,
        filename: 'index.html',
      })
    );
  }

  // Production rules
  rules.push(
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader!sass-loader',
      }),
    }
  );
} else {
  // Development entry points
  entry.docs = path.join(docsPath, 'docs.js');

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
      test: /\.scss$/,
      exclude: /node_modules/,
      use: [
        'style-loader',
        'css-loader?sourceMap',
        'sass-loader?sourceMap',
      ],
    }
);
}

module.exports = {
  devtool: isProduction ? false : 'source-map',
  context: isProduction ? outputDistPath : sourcePath,
  entry,
  output: {
    path: outputDistPath,
    // publicPath: '/',
    filename: '[name].js',
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath,
    ],
  },
  plugins,
  devServer: {
    contentBase: isProduction ? distPath : sourcePath,
    historyApiFallback: true,
    port: 3000,
    compress: isProduction,
    inline: !isProduction,
    hot: !isProduction,
    host: '0.0.0.0',
    disableHostCheck: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m',
      },
    },
  },
};
