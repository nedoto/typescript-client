const path = require('path');

module.exports = {
  entry: './src/NedotoClient.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'nedoto-client-1.0.0.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  watch: true,
};
