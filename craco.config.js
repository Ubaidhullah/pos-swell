const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL),
        })
      );
      return webpackConfig;
    },
  },
};
