const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

module.exports = Merge(CommonConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  resolve: {
    alias: { 'react-dom': '@hot-loader/react-dom' },
  },
  plugins: [],
});
