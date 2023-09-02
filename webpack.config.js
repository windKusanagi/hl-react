const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const config = {
  entry: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    filename: 'js/bundle.[name].[contenthash:5].js',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  devServer: {
    client: {
      overlay: false,
    },
    host: '0.0.0.0',
    port: 8000,
    historyApiFallback: true,
    https: !!process.env.HTTPS,
  },
  devtool: process.env.MODE === 'production' ? false : 'inline-source-map',
  mode: process.env.MODE === 'development' ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(less)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        type: 'asset',
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.jsx', '.js', '.ts', '.tsx'],
    modules: ['node_modules'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/styles.[name].[contenthash:5].css',
      chunkFilename: 'css/[id].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    new webpack.DefinePlugin({
      MODE: JSON.stringify(process.env.MODE),
    }),
    new NodePolyfillPlugin(),
    new Dotenv(),
  ],
};

module.exports = config;
