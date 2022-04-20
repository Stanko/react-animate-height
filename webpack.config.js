/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const NODE_ENV = process.env.NODE_ENV || "development";
const EXAMPLE = process.env.EXAMPLE || "false";
const isExample = EXAMPLE === "true";
const isProduction = NODE_ENV === "production";

const distPath = path.join(__dirname, "./dist");
const exampleDistPath = path.join(__dirname, "./dist-docs");
const docsPath = path.join(__dirname, "./docs");

const outputDistPath = isExample ? exampleDistPath : distPath;

module.exports = {
  entry: "./docs/docs.tsx",
  mode: isProduction ? "production" : "development",
  output: {
    path: outputDistPath,
    filename: "[name].js",
  },
  optimization: {
    moduleIds: "named",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: "swc-loader",
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [
      ".webpack-loader.js",
      ".web-loader.js",
      ".loader.js",
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
    ],
    fallback: {
      events: require.resolve("events/"),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(NODE_ENV),
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(docsPath, "index.html"),
      path: outputDistPath,
      filename: "index.html",
    }),
    new MiniCssExtractPlugin({ filename: "styles.css" }),
  ],
  devServer: {
    static: {
      directory: distPath,
    },
    historyApiFallback: true,
    compress: true,
    hot: true,
    host: "0.0.0.0",
    allowedHosts: "all",
  },
};
