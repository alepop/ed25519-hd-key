const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify"),
      "string_decoder": require.resolve("string_decoder/"),
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/"),
      "process": require.resolve("process/browser")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    devMiddleware: {
      publicPath: '/', // Serve bundle.js from root
    },
    compress: true,
    port: 9000,
  },
};
