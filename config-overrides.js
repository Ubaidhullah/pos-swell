const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = function override(config, env) {
  config.plugins = (config.plugins || []).concat([
    new Dotenv({
      systemvars: true,
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ]);
  return config;
};