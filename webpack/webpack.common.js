const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const root = process.cwd();
const src = path.resolve(root, 'src/');
const build = path.resolve(root, 'build');

module.exports = {
  context: src,
  entry: ['@babel/polyfill', './index.js'],
  output: {
    path: build,
    publicPath: '/',
    filename: '[name]_[hash].js',
    chunkFilename: '[name]_[hash].js',
    sourceMapFilename: '[name]_[hash].map',
  },
  resolve: {
    extensions: ['.ts', '.js', '.jsx', '.json'],
    modules: [src, 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /(\.jsx?$)/,
        loader: 'babel-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff|woff2)(\?[a-z0-9]+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
  devServer: {
    contentBase: build,
    historyApiFallback: true,
    port: 32415,
    hot: true,
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(root, '/assets/index.html'),
      filename: 'index.html',
      inject: 'body',
    }),
  ],
};
