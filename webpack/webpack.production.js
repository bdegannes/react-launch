const Merge = require('webpack-merge');
const webpack = require('webpack');
const CommonConfig = require('./webpack.common.js');

module.exports = Merge(CommonConfig, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
